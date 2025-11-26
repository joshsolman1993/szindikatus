import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerritoriesService } from './territories.service';
import { TerritoriesController } from './territories.controller';
import { District } from './entities/district.entity';
import { Clan } from '../clans/entities/clan.entity';
import { User } from '../users/entities/user.entity';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([District, Clan, User]),
        EventsModule,
    ],
    controllers: [TerritoriesController],
    providers: [TerritoriesService],
    exports: [TerritoriesService],
})
export class TerritoriesModule { }
