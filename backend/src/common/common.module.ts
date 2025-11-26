import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegenerationService } from './services/regeneration/regeneration.service';
import { EventsService } from './services/events.service';
import { User } from '../users/entities/user.entity';
import { ChatModule } from '../chat/chat.module';
import { MissionsModule } from '../missions/missions.module';

import { LevelingService } from './services/leveling.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), ChatModule, MissionsModule],
    providers: [RegenerationService, EventsService, LevelingService],
    exports: [RegenerationService, EventsService, LevelingService],
})
export class CommonModule { }
