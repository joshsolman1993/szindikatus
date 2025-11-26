import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionsService } from './missions.service';
import { MissionsController } from './missions.controller';
import { Mission } from './entities/mission.entity';
import { UserMission } from './entities/user-mission.entity';
import { User } from '../users/entities/user.entity';
import { EventsModule } from '../events/events.module';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Mission, UserMission, User]),
        EventsModule,
    ],
    controllers: [MissionsController],
    providers: [MissionsService],
    exports: [MissionsService],
})
export class MissionsModule { }
