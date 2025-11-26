import { Module } from '@nestjs/common';
import { CrimesService } from './crimes.service';
import { CrimesController } from './crimes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crime } from './entities/crime.entity';
import { User } from '../users/entities/user.entity';

import { CommonModule } from '../common/common.module';
import { District } from '../territories/entities/district.entity';
import { Clan } from '../clans/entities/clan.entity';
import { MissionsModule } from '../missions/missions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Crime, User, District, Clan]),
    CommonModule,
    MissionsModule
  ],
  controllers: [CrimesController],
  providers: [CrimesService],
  exports: [CrimesService]
})
export class CrimesModule { }
