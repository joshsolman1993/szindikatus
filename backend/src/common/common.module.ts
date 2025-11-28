import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegenerationService } from './services/regeneration/regeneration.service';
import { DailyResetService } from './services/daily-reset/daily-reset.service';
import { User } from '../users/entities/user.entity';
import { UserMission } from '../missions/entities/user-mission.entity';
import { ChatModule } from '../chat/chat.module';
import { MissionsModule } from '../missions/missions.module';
import { EventsModule } from '../events/events.module';

import { LevelingService } from './services/leveling.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserMission]),
    ChatModule,
    MissionsModule,
    EventsModule,
  ],
  providers: [RegenerationService, DailyResetService, LevelingService],
  exports: [
    RegenerationService,
    DailyResetService,
    LevelingService,
    EventsModule,
  ],
})
export class CommonModule {}
