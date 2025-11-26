import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegenerationService } from './services/regeneration/regeneration.service';
import { User } from '../users/entities/user.entity';
import { ChatModule } from '../chat/chat.module';
import { MissionsModule } from '../missions/missions.module';
import { EventsModule } from '../events/events.module';

import { LevelingService } from './services/leveling.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), ChatModule, MissionsModule, EventsModule],
    providers: [RegenerationService, LevelingService],
    exports: [RegenerationService, LevelingService, EventsModule],
})
export class CommonModule { }
