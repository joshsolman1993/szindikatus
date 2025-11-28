import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from '../items/entities/inventory.entity';
import { Item } from '../items/entities/item.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  // Listázza a játékos tárgyait
  async getUserItems(userId: string): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { userId },
      relations: ['item'],
      order: { createdAt: 'DESC' },
    });
  }

  // Felszerelés/Levétel
  async equipItem(
    userId: string,
    inventoryId: string,
  ): Promise<{ message: string }> {
    return await this.inventoryRepository.manager.transaction(
      async (manager) => {
        const inventoryItem = await manager.findOne(Inventory, {
          where: { id: inventoryId, userId },
          relations: ['item'],
        });

        if (!inventoryItem) {
          throw new ConflictException(
            'Ez a tárgy nem található a leltáradban.',
          );
        }

        const itemType = inventoryItem.item.type;

        if (inventoryItem.isEquipped) {
          // Levétel
          inventoryItem.isEquipped = false;
          await manager.save(inventoryItem);
          return { message: `${inventoryItem.item.name} levéve.` };
        } else {
          // Felszerelés
          // Auto-Unequip: Levesszük az összes ugyanolyan típusú tárgyat
          await manager.update(
            Inventory,
            { userId, isEquipped: true },
            { isEquipped: false },
          );

          // Most csak azokat, amik ugyanolyan típusúak
          const otherEquippedItems = await manager.find(Inventory, {
            where: { userId, isEquipped: true },
            relations: ['item'],
          });

          for (const otherItem of otherEquippedItems) {
            if (otherItem.item.type === itemType) {
              otherItem.isEquipped = false;
              await manager.save(otherItem);
            }
          }

          // Felszereljük az újat
          inventoryItem.isEquipped = true;
          await manager.save(inventoryItem);

          return { message: `${inventoryItem.item.name} felszerelve!` };
        }
      },
    );
  }
}
