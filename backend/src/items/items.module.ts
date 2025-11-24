import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Inventory } from './entities/inventory.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Item, Inventory])],
    exports: [TypeOrmModule],
})
export class ItemsModule { }
