import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Inventory } from '../items/entities/inventory.entity';
import { Item } from '../items/entities/item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Inventory, Item])],
    providers: [InventoryService],
    controllers: [InventoryController],
    exports: [InventoryService],
})
export class InventoryModule { }
