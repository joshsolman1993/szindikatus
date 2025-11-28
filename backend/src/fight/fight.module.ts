import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FightService } from './fight.service';
import { FightController } from './fight.controller';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';
import { MissionsModule } from '../missions/missions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    CommonModule,
    MissionsModule,
  ],
  providers: [FightService],
  controllers: [FightController],
  exports: [FightService],
})
export class FightModule {}
