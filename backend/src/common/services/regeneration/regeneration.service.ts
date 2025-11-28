import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { GameBalance } from '../../../config/game-balance.config';

@Injectable()
export class RegenerationService {
    private readonly logger = new Logger(RegenerationService.name);

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    /**
     * Automatikus regeneráció minden percben
     * - Energia: +5 / perc (max: MAX_ENERGY)
     * - Bátorság: +1 / perc (max: MAX_NERVE)
     * - HP: +5 / perc (max: MAX_HP)
     * 
     * Optimalizált: Egyetlen SQL UPDATE parancs, csak azokat a usereket frissíti,
     * akiknek legalább egy értéke nem maximális.
     */
    @Cron(CronExpression.EVERY_MINUTE)
    async handleRegeneration() {
        this.logger.log('Starting regeneration tick...');

        try {
            const result = await this.usersRepository
                .createQueryBuilder()
                .update(User)
                .set({
                    energy: () => `LEAST(energy + 5, ${GameBalance.MAX_ENERGY})`,
                    nerve: () => `LEAST(nerve + 1, ${GameBalance.MAX_NERVE})`,
                    hp: () => `LEAST(hp + 5, ${GameBalance.MAX_HP})`,
                })
                .where(
                    `energy < ${GameBalance.MAX_ENERGY} OR nerve < ${GameBalance.MAX_NERVE} OR hp < ${GameBalance.MAX_HP}`
                )
                .execute();

            this.logger.log(`Regeneration tick completed. Updated ${result.affected} users.`);
        } catch (error) {
            this.logger.error('Regeneration tick failed:', error);
        }
    }
}
