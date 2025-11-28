import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { MarketListing } from './entities/market-listing.entity';
import { Item } from '../items/entities/item.entity';
import { Inventory } from '../items/entities/inventory.entity';
import { User } from '../users/entities/user.entity';
import { EventsModule } from '../events/events.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketListing, Item, Inventory, User]),
    EventsModule,
    ChatModule,
  ],
  providers: [MarketService],
  controllers: [MarketController],
  exports: [MarketService],
})
export class MarketModule {}
