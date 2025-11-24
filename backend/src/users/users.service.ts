import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from './entities/user.entity';
import { Inventory } from '../items/entities/inventory.entity';
import { RegisterDto } from '../auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Inventory)
        private inventoryRepository: Repository<Inventory>,
    ) { }

    async create(registerDto: RegisterDto): Promise<User> {
        const { username, email, password } = registerDto;

        // Jelszó hashelése
        const salt = await bcrypt.genSalt();
        const password_hash = await bcrypt.hash(password, salt);

        const user = this.usersRepository.create({
            username,
            email,
            password_hash,
        });

        try {
            return await this.usersRepository.save(user);
        } catch (error) {
            // Postgres error code 23505 is unique_violation
            if (error.code === '23505') {
                throw new ConflictException('Ez az email cím vagy felhasználónév már foglalt.');
            }
            throw new InternalServerErrorException();
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id }, relations: ['clan'] });
    }

    async findAllExcept(userId: string): Promise<User[]> {
        // Utolsó 50 aktív játékos, kivéve saját magát
        // Rendezés: legutóbb frissített (updatedAt) szerint
        return this.usersRepository.find({
            where: {
                id: Not(userId),
            },
            relations: ['clan'],
            order: {
                updatedAt: 'DESC',
            },
            take: 50,
        });
    }

    async refillEnergy(userId: string): Promise<void> {
        // Fejlesztői eszköz: Maxra tölt mindent
        // Importáljuk a GameBalance-t
        const { GameBalance } = require('../config/game-balance.config');

        await this.usersRepository.update(userId, {
            energy: GameBalance.MAX_ENERGY,
            nerve: GameBalance.MAX_NERVE,
            hp: GameBalance.MAX_HP,
        });
    }

    async train(userId: string, stat: string): Promise<User> {
        const { GameBalance } = require('../config/game-balance.config');

        // Validáció: Engedélyezett stat nevek
        const validStats = ['str', 'tol', 'int', 'spd'];
        if (!validStats.includes(stat)) {
            throw new ConflictException(`Érvénytelen stat: ${stat}. Választható: ${validStats.join(', ')}`);
        }

        return await this.usersRepository.manager.transaction(async (manager) => {
            const user = await manager.findOne(User, { where: { id: userId } });

            if (!user) {
                throw new ConflictException('Felhasználó nem található.');
            }

            // Ellenőrizzük az energiát
            if (user.energy < GameBalance.GYM_ENERGY_COST) {
                throw new ConflictException('Nincs elég energiád az edzéshez.');
            }

            // Energia levonása
            user.energy -= GameBalance.GYM_ENERGY_COST;

            // Statisztika növelése (egyszerű +1 vagy képlet alapján)
            const currentStatValue = user.stats[stat];
            const increase = Math.max(1, Math.floor(1 + (currentStatValue * 0.01)));

            // JSONB update - csak a megadott kulcs frissítése
            user.stats = {
                ...user.stats,
                [stat]: currentStatValue + increase,
            };

            // Mentés
            await manager.save(user);
            return user;
        });
    }
    async calculateCombatStats(userId: string): Promise<{
        totalStr: number;
        totalTol: number;
        totalSpd: number;
        totalInt: number;
        bonuses: { str: number; def: number; spd: number };
        equippedItems: string[];
    }> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) throw new ConflictException('User not found');

        const equippedInventory = await this.inventoryRepository.find({
            where: { userId, isEquipped: true },
            relations: ['item'],
        });

        let bonusStr = 0;
        let bonusDef = 0;
        let bonusSpd = 0;
        const equippedItemNames: string[] = [];

        for (const inv of equippedInventory) {
            bonusStr += inv.item.bonusStr;
            bonusDef += inv.item.bonusDef;
            bonusSpd += inv.item.bonusSpd;
            equippedItemNames.push(inv.item.name);
        }

        return {
            totalStr: user.stats.str + bonusStr,
            totalTol: user.stats.tol + bonusDef,
            totalSpd: user.stats.spd + bonusSpd,
            totalInt: user.stats.int,
            bonuses: {
                str: bonusStr,
                def: bonusDef,
                spd: bonusSpd,
            },
            equippedItems: equippedItemNames,
        };
    }
}
