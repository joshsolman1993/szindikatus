import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Inventory } from './entities/inventory.entity';

import { LootService } from './loot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Inventory])],
  providers: [LootService],
  exports: [TypeOrmModule, LootService],
})
export class ItemsModule {}
