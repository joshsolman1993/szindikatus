import { Injectable, OnModuleInit, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Crime } from './entities/crime.entity';
import { User } from '../users/entities/user.entity';
import { District } from '../territories/entities/district.entity';
import { Clan } from '../clans/entities/clan.entity';
import { LevelingService } from '../common/services/leveling.service';
import { TalentId } from '../talents/talents.constants';
import { MissionsService } from '../missions/missions.service';
import { MissionRequirementType } from '../missions/entities/mission.entity';

@Injectable()
export class CrimesService implements OnModuleInit {
    private readonly logger = new Logger(CrimesService.name);

    constructor(
        @InjectRepository(Crime)
        private crimesRepository: Repository<Crime>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(District)
        private districtsRepository: Repository<District>,
        @InjectRepository(Clan)
        private clansRepository: Repository<Clan>,
        private dataSource: DataSource,
        private readonly levelingService: LevelingService,
        private readonly missionsService: MissionsService,
    ) { }

    async onModuleInit() {
        await this.seedCrimes();
    }

    private async seedCrimes() {
        const count = await this.crimesRepository.count();
        if (count === 0) {
            this.logger.log('Seeding crimes...');
            const crimes = [
                {
                    name: 'Néni szatyrának ellopása',
                    description: 'Könnyű zsákmány, de nem túl dicsőséges.',
                    energyCost: 2,
                    difficulty: 10,
                    minMoney: 10,
                    maxMoney: 50,
                    xpReward: 5,
                },
                {
                    name: 'Trafik rablás',
                    description: 'Gyors pénz, kis kockázat.',
                    energyCost: 5,
                    difficulty: 30,
                    minMoney: 100,
                    maxMoney: 300,
                    xpReward: 15,
                },
                {
                    name: 'Autófeltörés',
                    description: 'Csak a rádió kell, vagy az egész kocsi?',
                    energyCost: 8,
                    difficulty: 45,
                    minMoney: 250,
                    maxMoney: 600,
                    xpReward: 30,
                },
                {
                    name: 'Benzinkút kifosztása',
                    description: 'A kamerákra figyelj!',
                    energyCost: 10,
                    difficulty: 60,
                    minMoney: 500,
                    maxMoney: 1200,
                    xpReward: 50,
                },
                {
                    name: 'Bankautomata robbantás',
                    description: 'Nagy durranás, nagy lóvé.',
                    energyCost: 15,
                    difficulty: 80,
                    minMoney: 2000,
                    maxMoney: 5000,
                    xpReward: 100,
                },
            ];
            await this.crimesRepository.save(crimes);
            this.logger.log('Crimes seeded successfully.');
        }
    }

    async findAll(): Promise<Crime[]> {
        return this.crimesRepository.find({ order: { difficulty: 'ASC' } });
    }

    async commitCrime(userId: string, crimeId: number) {
        // Tranzakció indítása
        return this.dataSource.manager.transaction(async (entityManager) => {
            // User és Crime lekérése a tranzakción belül (lockolás opció lehetne, de most egyszerűen)
            const user = await entityManager.findOne(User, { where: { id: userId }, lock: { mode: 'pessimistic_write' } });
            const crime = await entityManager.findOne(Crime, { where: { id: crimeId } });

            if (!user) throw new NotFoundException('Felhasználó nem található');
            if (!crime) throw new NotFoundException('Bűntény nem található');

            // 1. Energia ellenőrzés
            if (user.energy < crime.energyCost) {
                throw new BadRequestException('Nincs elég energiád a bűntény elkövetéséhez.');
            }

            // 2. Siker kalkuláció
            // Képlet: (UserINT * 0.5 + 50) / Difficulty * RNG (0.5-1.5)
            // Egyszerűsítve: Ha a (UserINT + 20) >= Difficulty * RNG, akkor siker.
            const rng = Math.random() * 1.0 + 0.5; // 0.5 - 1.5
            const successChance = (user.stats.int + 20);
            const difficultyCheck = crime.difficulty * rng;

            const isSuccess = successChance >= difficultyCheck;

            // Energia levonás mindenképp
            user.energy -= crime.energyCost;

            let result = {
                success: false,
                gainedMoney: 0,
                gainedXp: 0,
                newEnergy: user.energy,
                message: '',
            };

            if (isSuccess) {
                // Jutalom
                let moneyReward = Math.floor(Math.random() * (crime.maxMoney - crime.minMoney + 1)) + crime.minMoney;

                // Talent Bonus: Street Wisdom (+5% Money)
                if (user.learnedTalents && user.learnedTalents.includes(TalentId.STREET_WISDOM)) {
                    moneyReward = Math.floor(moneyReward * 1.05);
                }

                // BigInt kezelés: stringként tároljuk, de számoláshoz konvertáljuk, majd vissza
                const currentCash = BigInt(user.cash);
                const newCash = currentCash + BigInt(moneyReward);
                user.cash = newCash.toString();

                user.stats.int += 0.1; // Kis stat növekedés

                user.xp += crime.xpReward;
                this.levelingService.checkLevelUp(user);

                result.success = true;
                result.gainedMoney = moneyReward;
                result.gainedXp = crime.xpReward;
                result.message = `Sikeres bűntény! Szereztél $${moneyReward}-t.`;

                // Track Mission Progress
                this.missionsService.trackProgress(userId, MissionRequirementType.CRIME, 1);

                // --- Territory Tax Logic ---
                // Determine district: use crime.districtId or random
                let districtId = crime.districtId;
                if (!districtId) {
                    // Random district 1-6
                    districtId = Math.floor(Math.random() * 6) + 1;
                }

                const district = await entityManager.findOne(District, {
                    where: { id: districtId },
                    relations: ['ownerClan'],
                });

                if (district && district.ownerClan) {
                    const taxAmount = Math.floor(moneyReward * district.taxRate);
                    if (taxAmount > 0) {
                        // Add to clan bank
                        const clan = await entityManager.findOne(Clan, { where: { id: district.ownerClan.id } });
                        if (clan) {
                            const currentBank = BigInt(clan.bank);
                            const newBank = currentBank + BigInt(taxAmount);
                            clan.bank = newBank.toString();
                            await entityManager.save(clan);
                            // Optional: Log or notify?
                        }
                    }
                }
                // ---------------------------

            } else {
                // Bukás
                // Esetleg HP levonás vagy börtön (később)
                user.hp = Math.max(0, user.hp - 5);
                result.message = 'A bűntény nem sikerült! Menekülnöd kellett és megsérültél.';
            }

            // Mentés
            await entityManager.save(user);

            return result;
        });
    }
}
