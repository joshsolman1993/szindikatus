import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { GameBalance } from '../config/game-balance.config';

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
    calculateOutcome(attacker: User, defender: User): boolean {
        const attackerScore = (attacker.stats.str + attacker.stats.spd) * (0.8 + Math.random() * 0.4);
        const defenderScore = (defender.stats.tol + defender.stats.spd) * (0.8 + Math.random() * 0.4);

        return attackerScore > defenderScore;
    }

    // Harc végrehajtása (tranzakcióban)
    async executeFight(attackerId: string, defenderId: string): Promise<FightResult> {
        return await this.usersRepository.manager.transaction(async (manager) => {
            const attacker = await manager.findOne(User, { where: { id: attackerId } });
            const defender = await manager.findOne(User, { where: { id: defenderId } });

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

            // Kimenetel kiszámítása
            const attackerWins = this.calculateOutcome(attacker, defender);

            const logs: string[] = [];
            let moneyStolen = 0;
            let xpGained = 0;
            let damageDealt = 0;
            let damageTaken = 0;

            if (attackerWins) {
                // GYŐZELEM
                logs.push(`Te bevittél egy jobb horgot...`);
                logs.push(`${defender.username} összeesett!`);

                // Pénz rablás
                const defenderCash = parseInt(defender.cash);
                moneyStolen = Math.floor(defenderCash * GameBalance.FIGHT_CASH_STEAL_PERCENTAGE);

                attacker.cash = (parseInt(attacker.cash) + moneyStolen).toString();
                defender.cash = (defenderCash - moneyStolen).toString();

                // XP
                xpGained = GameBalance.FIGHT_XP_REWARD;

                // HP változás
                damageDealt = GameBalance.FIGHT_WIN_DEFENDER_DAMAGE;
                damageTaken = GameBalance.FIGHT_WIN_ATTACKER_DAMAGE;

                defender.hp = Math.max(0, defender.hp - damageDealt);
                attacker.hp = Math.max(0, attacker.hp - damageTaken);

                logs.push(`Elloptál $${moneyStolen}-t és szereztél ${xpGained} XP-t!`);
            } else {
                // VERESÉG
                logs.push(`${defender.username} túl erős volt...`);
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
