import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMission } from '../../../missions/entities/user-mission.entity';
import { MissionType } from '../../../missions/entities/mission.entity';

@Injectable()
export class DailyResetService {
    private readonly logger = new Logger(DailyResetService.name);

    constructor(
        @InjectRepository(UserMission)
        private userMissionsRepository: Repository<UserMission>,
    ) { }

    /**
     * Napi reset - minden éjfélkor (00:00) fut le
     * - DAILY típusú missziók resetelése (progress, isCompleted, isClaimed)
     * 
     * Cron pattern: '0 0 * * *' = minden nap 00:00-kor
     */
    @Cron('0 0 * * *', {
        timeZone: 'Europe/Budapest',
    })
    async handleDailyReset() {
        this.logger.log('Starting daily reset...');

        try {
            // DAILY missziók resetelése
            const result = await this.userMissionsRepository
                .createQueryBuilder('um')
                .innerJoin('um.mission', 'mission')
                .update(UserMission)
                .set({
                    progress: 0,
                    isCompleted: false,
                    isClaimed: false,
                })
                .where('mission.type = :type', { type: MissionType.DAILY })
                .execute();

            this.logger.log(`Daily reset completed. Reset ${result.affected} daily missions.`);
        } catch (error) {
            this.logger.error('Daily reset failed:', error);
        }
    }

    /**
     * Manual trigger for testing purposes (csak development módban)
     * Használat: DailyResetService.triggerManualReset()
     */
    async triggerManualReset() {
        if (process.env.NODE_ENV === 'production') {
            this.logger.warn('Manual reset is disabled in production!');
            return;
        }

        this.logger.log('Manual daily reset triggered...');
        await this.handleDailyReset();
    }
}
