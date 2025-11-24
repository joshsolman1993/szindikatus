import { Module } from '@nestjs/common';
import { CrimesService } from './crimes.service';
import { CrimesController } from './crimes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crime } from './entities/crime.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Crime, User])],
  controllers: [CrimesController],
  providers: [CrimesService],
  exports: [CrimesService]
})
export class CrimesModule { }
