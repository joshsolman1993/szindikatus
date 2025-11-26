import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from './entities/property.entity';
import { UserProperty } from './entities/user-property.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, UserProperty, User])],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule { }
