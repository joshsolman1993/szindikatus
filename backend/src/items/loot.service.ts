import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory, ItemRarity } from './entities/inventory.entity';

@Injectable()
export class LootService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async generateLoot(baseItemId: string, userId: string): Promise<Inventory> {
    const roll = Math.random() * 100;
    let rarity = ItemRarity.COMMON;
    let quality = 1.0;

    if (roll < 60) {
      rarity = ItemRarity.COMMON;
      quality = 1.0;
    } else if (roll < 85) {
      rarity = ItemRarity.UNCOMMON;
      quality = 1.1;
    } else if (roll < 95) {
      rarity = ItemRarity.RARE;
      quality = 1.25;
    } else if (roll < 99) {
      rarity = ItemRarity.EPIC;
      quality = 1.5;
    } else {
      rarity = ItemRarity.LEGENDARY;
      quality = 2.0;
    }

    const newItem = this.inventoryRepository.create({
      userId,
      itemId: baseItemId,
      rarity,
      quality,
      isEquipped: false,
      isListed: false,
    });

    return this.inventoryRepository.save(newItem);
  }
}
