import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasinoService } from './casino.service';
import { CasinoController } from './casino.controller';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [CasinoController],
  providers: [CasinoService],
})
export class CasinoModule {}
