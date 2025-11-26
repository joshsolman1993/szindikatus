import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item, ItemType } from '../items/entities/item.entity';
import { Inventory } from '../items/entities/inventory.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MarketService implements OnModuleInit {
    constructor(
        @InjectRepository(Item)
        private itemsRepository: Repository<Item>,
        @InjectRepository(Inventory)
        private inventoryRepository: Repository<Inventory>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        await this.seedShopItems();
    }

    // Seed initial shop items
    private async seedShopItems() {
        const count = await this.itemsRepository.count();
        if (count > 0) return; // Már van adat

        const initialItems = [
            { name: 'Rozsdás Boxer', type: ItemType.WEAPON, cost: 100, bonusStr: 2, bonusDef: 0, bonusSpd: 0, image: 'brass-knuckles' },
            { name: 'Baseball ütő', type: ItemType.WEAPON, cost: 500, bonusStr: 5, bonusDef: 0, bonusSpd: 0, image: 'baseball-bat' },
            { name: 'Glock 17', type: ItemType.WEAPON, cost: 2500, bonusStr: 15, bonusDef: 0, bonusSpd: 0, image: 'pistol' },
            { name: 'Bőrkabát', type: ItemType.ARMOR, cost: 500, bonusStr: 0, bonusDef: 5, bonusSpd: 0, image: 'leather-jacket' },
            { name: 'Stikli mellény', type: ItemType.ARMOR, cost: 2000, bonusStr: 0, bonusDef: 15, bonusSpd: 0, image: 'bulletproof-vest' },
            { name: 'Kevlár Mellény', type: ItemType.ARMOR, cost: 5000, bonusStr: 0, bonusDef: 25, bonusSpd: 0, image: 'kevlar' },
        ];

        for (const itemData of initialItems) {
            const item = this.itemsRepository.create(itemData);
            await this.itemsRepository.save(item);
        }

        console.log('✅ Shop items seeded');
    }

    // Listázza az összes shop itemet
    async getShopItems(): Promise<Item[]> {
        return this.itemsRepository.find({
            order: { cost: 'ASC' },
        });
    }

    // Vásárlás
    async buyItem(userId: string, itemId: string): Promise<{ message: string; remainingCash: string }> {
        return await this.usersRepository.manager.transaction(async (manager) => {
            const user = await manager.findOne(User, { where: { id: userId }, lock: { mode: 'pessimistic_write' } });
            const item = await manager.findOne(Item, { where: { id: itemId } });

            if (!user || !item) {
                throw new ConflictException('Felhasználó vagy tárgy nem található.');
            }

            const userCash = parseInt(user.cash);
            if (userCash < item.cost) {
                throw new ConflictException('Nincs elég pénzed ehhez a tárgyhoz!');
            }

            // Pénz levonása
            user.cash = (userCash - item.cost).toString();
            await manager.save(user);

            // Hozzáadás az inventoryhoz
            const inventoryItem = manager.create(Inventory, {
                userId: user.id,
                itemId: item.id,
                isEquipped: false,
            });
            await manager.save(inventoryItem);

            return {
                message: `Sikeresen megvetted: ${item.name}!`,
                remainingCash: user.cash,
            };
        });
    }
}
