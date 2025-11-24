import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FightService } from './fight.service';
import { FightController } from './fight.controller';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), UsersModule],
    providers: [FightService],
    controllers: [FightController],
    exports: [FightService],
})
export class FightModule { }
