import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { GameBalance } from '../../config/game-balance.config';
import { EventsService } from './events.service';
import { MissionsService } from '../../missions/missions.service';
import { MissionRequirementType } from '../../missions/entities/mission.entity';

@Injectable()
export class LevelingService {
    constructor(
        private readonly eventsService: EventsService,
        private readonly missionsService: MissionsService,
    ) { }

    public getXpRequired(level: number): number {
        return Math.floor(100 * Math.pow(level, 1.5));
    }

    public checkLevelUp(user: User): boolean {
        let leveledUp = false;
        while (true) {
            const xpRequired = this.getXpRequired(user.level);
            if (user.xp >= xpRequired) {
                user.level += 1;
                user.talentPoints += 1;

                // Refill stats to max
                // TODO: Calculate max stats based on talents (Adrenaline: +5 Max Energy)
                // For now, using base MAX values.
                user.energy = GameBalance.MAX_ENERGY;
                user.nerve = GameBalance.MAX_NERVE;
                user.hp = GameBalance.MAX_HP;

                leveledUp = true;
            } else {
                break;
            }
        }

        if (leveledUp) {
            this.eventsService.broadcastToUser(user.id, 'level-up', {
                level: user.level,
                talentPoints: user.talentPoints,
            });

            // Track Mission Progress
            this.missionsService.trackProgress(user.id, MissionRequirementType.LEVEL_UP, user.level);
        }

        return leveledUp;
    }
}
