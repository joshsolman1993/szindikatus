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

    @Cron(CronExpression.EVERY_MINUTE)
    async handleRegeneration() {
        this.logger.log('Starting regeneration tick...');

        // Energia visszatöltés: +5, de max 100
        // Bátorság visszatöltés: +1, de max 10

        // Optimalizált SQL UPDATE
        await this.usersRepository
            .createQueryBuilder()
            .update(User)
            .set({
                energy: () => `LEAST(energy + 5, ${GameBalance.MAX_ENERGY})`,
                nerve: () => `LEAST(nerve + 1, ${GameBalance.MAX_NERVE})`,
            })
            .where(`energy < ${GameBalance.MAX_ENERGY} OR nerve < ${GameBalance.MAX_NERVE}`)
            .execute();

        this.logger.log('Regeneration tick completed.');
    }
}
