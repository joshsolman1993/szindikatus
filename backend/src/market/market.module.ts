import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { Item } from '../items/entities/item.entity';
import { Inventory } from '../items/entities/inventory.entity';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Item, Inventory, User])],
    providers: [MarketService],
    controllers: [MarketController],
    exports: [MarketService],
})
export class MarketModule { }
