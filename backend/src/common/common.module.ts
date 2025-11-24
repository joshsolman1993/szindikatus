import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegenerationService } from './services/regeneration/regeneration.service';
import { EventsService } from './services/events.service';
import { User } from '../users/entities/user.entity';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ChatModule],
  providers: [RegenerationService, EventsService],
  exports: [RegenerationService, EventsService],
})
export class CommonModule { }
