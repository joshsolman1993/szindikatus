import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { GameBalance } from '../config/game-balance.config';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';
import { LevelingService } from '../common/services/leveling.service';
import { TalentId } from '../talents/talents.constants';
import { MissionsService } from '../missions/missions.service';
import { MissionRequirementType } from '../missions/entities/mission.entity';

interface CombatStats {
    totalStr: number;
    totalTol: number;
    totalSpd: number;
    totalInt: number;
    bonuses: { str: number; def: number; spd: number };
    equippedItems: string[];
    learnedTalents: string[];
}

export interface FightResult {
    winner: boolean;
    moneyStolen: number;
    xpGained: number;
    damageDealt: number;
    damageTaken: number;
    logs: string[];
}

@Injectable()
export class FightService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private usersService: UsersService,
        private eventsService: EventsService,
        private readonly levelingService: LevelingService,
        private readonly missionsService: MissionsService,
    ) { }

    // Validáció: Lehet-e támadni
    canAttack(attacker: User, defender: User): { canAttack: boolean; reason?: string } {
        // Elég Bátorság?
        if (attacker.nerve < GameBalance.FIGHT_NERVE_COST) {
            return { canAttack: false, reason: 'Nincs elég bátorságod a támadáshoz!' };
        }

        // Elég HP a támadónak?
        if (attacker.hp < GameBalance.FIGHT_MIN_HP_TO_ATTACK) {
            return { canAttack: false, reason: 'Túl sérült vagy a támadáshoz!' };
        }

        // Áldozat életben van?
        if (defender.hp <= 0) {
            return { canAttack: false, reason: 'Az áldozat már a kórházban van!' };
        }

        // Saját magát nem támadhatja
        if (attacker.id === defender.id) {
            return { canAttack: false, reason: 'Nem támadhatod meg saját magad!' };
        }

        return { canAttack: true };
    }

    // Harc kimenetelének kiszámítása
    calculateOutcome(attackerStats: CombatStats, defenderStats: CombatStats): boolean {
        let attackerScore = (attackerStats.totalStr + attackerStats.totalSpd) * (0.8 + Math.random() * 0.4);
        let defenderScore = (defenderStats.totalTol + defenderStats.totalSpd) * (0.8 + Math.random() * 0.4);

        // Talent Bonuses
        if (attackerStats.learnedTalents && attackerStats.learnedTalents.includes(TalentId.SHARPSHOOTER)) {
            attackerScore *= 1.10;
        }
        if (defenderStats.learnedTalents && defenderStats.learnedTalents.includes(TalentId.IRON_SKIN)) {
            defenderScore *= 1.05;
        }

        return attackerScore > defenderScore;
    }

    // Harc végrehajtása (tranzakcióban)
    async executeFight(attackerId: string, defenderId: string): Promise<FightResult> {
        return await this.usersRepository.manager.transaction(async (manager) => {
            // Deadlock prevention: Lock users in ID order
            const [firstId, secondId] = [attackerId, defenderId].sort();

            const firstUser = await manager.findOne(User, { where: { id: firstId }, lock: { mode: 'pessimistic_write' } });
            const secondUser = await manager.findOne(User, { where: { id: secondId }, lock: { mode: 'pessimistic_write' } });

            const attacker = attackerId === firstId ? firstUser : secondUser;
            const defender = defenderId === firstId ? firstUser : secondUser;

            if (!attacker || !defender) {
                throw new ConflictException('Felhasználó nem található.');
            }

            // Validáció
            const validation = this.canAttack(attacker, defender);
            if (!validation.canAttack) {
                throw new ConflictException(validation.reason);
            }

            // Bátorság levonása
            attacker.nerve -= GameBalance.FIGHT_NERVE_COST;

            // Statisztikák lekérése (felszereléssel együtt)
            const attackerStats = await this.usersService.calculateCombatStats(attackerId);
            const defenderStats = await this.usersService.calculateCombatStats(defenderId);

            // Kimenetel kiszámítása
            const attackerWins = this.calculateOutcome(attackerStats, defenderStats);

            const logs: string[] = [];
            let moneyStolen = 0;
            let xpGained = 0;
            let damageDealt = 0;
            let damageTaken = 0;

            if (attackerWins) {
                // GYŐZELEM
                logs.push(`Te bevittél egy jobb horgot...`);
                if (attackerStats.equippedItems.length > 0) {
                    logs.push(`A(z) ${attackerStats.equippedItems.join(', ')} segítségével extra sebzést vittél be!`);
                }
                logs.push(`${defender.username} összeesett!`);

                // Pénz rablás
                const defenderCash = parseInt(defender.cash);
                moneyStolen = Math.floor(defenderCash * GameBalance.FIGHT_CASH_STEAL_PERCENTAGE);

                attacker.cash = (parseInt(attacker.cash) + moneyStolen).toString();
                defender.cash = (defenderCash - moneyStolen).toString();

                // XP
                xpGained = GameBalance.FIGHT_XP_REWARD;
                attacker.xp += xpGained;
                this.levelingService.checkLevelUp(attacker);

                // HP változás
                damageDealt = GameBalance.FIGHT_WIN_DEFENDER_DAMAGE;
                damageTaken = GameBalance.FIGHT_WIN_ATTACKER_DAMAGE;

                defender.hp = Math.max(0, defender.hp - damageDealt);
                attacker.hp = Math.max(0, attacker.hp - damageTaken);

                logs.push(`Elloptál $${moneyStolen}-t és szereztél ${xpGained} XP-t!`);

                // Broadcast big wins
                if (moneyStolen > 1000) {
                    this.eventsService.broadcastSystemEvent(
                        `HÍR: ${attacker.username} brutálisan helybenhagyta ${defender.username}-t és elvett tőle $${moneyStolen}-t!`,
                        'combat'
                    );
                }

                // Track Mission Progress
                this.missionsService.trackProgress(attackerId, MissionRequirementType.FIGHT_WIN, 1);
            } else {
                // VERESÉG
                logs.push(`${defender.username} túl erős volt...`);
                if (defenderStats.equippedItems.length > 0) {
                    logs.push(`Az ellenfél a(z) ${defenderStats.equippedItems.join(', ')} segítségével hárított!`);
                }
                logs.push(`Kaptál egy nagy pofont!`);

                // XP az áldozat védelmében
                xpGained = 0;

                // HP változás
                damageTaken = GameBalance.FIGHT_LOSE_ATTACKER_DAMAGE;

                attacker.hp = Math.max(0, attacker.hp - damageTaken);

                logs.push(`Vesztettél ${damageTaken} HP-t!`);
            }

            // Mentés
            await manager.save(attacker);
            await manager.save(defender);

            return {
                winner: attackerWins,
                moneyStolen,
                xpGained,
                damageDealt,
                damageTaken,
                logs,
            };
        });
    }
}
