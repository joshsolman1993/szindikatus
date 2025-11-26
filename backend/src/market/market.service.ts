import { Injectable, ConflictException, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item, ItemType } from '../items/entities/item.entity';
import { Inventory } from '../items/entities/inventory.entity';
import { User } from '../users/entities/user.entity';
import { MarketListing } from './entities/market-listing.entity';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class MarketService implements OnModuleInit {
    constructor(
        @InjectRepository(Item)
        private itemsRepository: Repository<Item>,
        @InjectRepository(Inventory)
        private inventoryRepository: Repository<Inventory>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(MarketListing)
        private marketListingRepository: Repository<MarketListing>,
        private eventsGateway: EventsGateway,
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

    // ==================== PLAYER MARKETPLACE ====================

    // Aktív listázások lekérése
    async getListings(): Promise<MarketListing[]> {
        return await this.marketListingRepository.find({
            where: { isActive: true },
            relations: ['seller', 'inventory', 'inventory.item'],
            order: { createdAt: 'DESC' },
        });
    }

    // Saját listázások lekérése
    async getMyListings(userId: string): Promise<MarketListing[]> {
        return await this.marketListingRepository.find({
            where: { sellerId: userId, isActive: true },
            relations: ['inventory', 'inventory.item'],
            order: { createdAt: 'DESC' },
        });
    }

    // Tárgy feltétele a piacra
    async createListing(userId: string, inventoryId: string, price: string): Promise<MarketListing> {
        return await this.usersRepository.manager.transaction(async (manager) => {
            // Inventory lekérése lockkal
            const inventory = await manager.findOne(Inventory, {
                where: { id: inventoryId },
                relations: ['item'],
                lock: { mode: 'pessimistic_write' },
            });

            if (!inventory) {
                throw new NotFoundException('A tárgy nem található.');
            }

            // Validációk
            if (inventory.userId !== userId) {
                throw new BadRequestException('Ez nem a te tárgyad!');
            }

            if (inventory.isEquipped) {
                throw new BadRequestException('Nem listázhatod, amíg fel van szerelve!');
            }

            if (inventory.isListed) {
                throw new BadRequestException('Ez a tárgy már fel van téve a piacra!');
            }

            // Ellenőrizzük, hogy nincs-e már aktív listing rá
            const existingListing = await manager.findOne(MarketListing, {
                where: { inventoryId, isActive: true },
            });

            if (existingListing) {
                throw new BadRequestException('Ez a tárgy már listázva van!');
            }

            const priceNum = parseInt(price);
            if (isNaN(priceNum) || priceNum <= 0) {
                throw new BadRequestException('Érvénytelen ár!');
            }

            // Inventory zárolása
            inventory.isListed = true;
            await manager.save(inventory);

            // Listing létrehozása
            const listing = manager.create(MarketListing, {
                sellerId: userId,
                inventoryId,
                price,
                isActive: true,
            });

            return await manager.save(listing);
        });
    }

    // Tárgy vásárlása a piacon
    async buyListing(buyerId: string, listingId: string): Promise<{ message: string; item: string }> {
        return await this.usersRepository.manager.transaction(async (manager) => {
            // Listing lekérése lockkal
            const listing = await manager.findOne(MarketListing, {
                where: { id: listingId },
                relations: ['seller', 'inventory', 'inventory.item'],
                lock: { mode: 'pessimistic_write' },
            });

            if (!listing || !listing.isActive) {
                throw new NotFoundException('Ez az ajánlat már nem elérhető!');
            }

            if (listing.sellerId === buyerId) {
                throw new BadRequestException('Nem vásárolhatod meg a saját tárgyad!');
            }

            // Vevő és eladó lekérése lockkal
            const buyer = await manager.findOne(User, {
                where: { id: buyerId },
                lock: { mode: 'pessimistic_write' },
            });

            const seller = await manager.findOne(User, {
                where: { id: listing.sellerId },
                lock: { mode: 'pessimistic_write' },
            });

            if (!buyer || !seller) {
                throw new NotFoundException('Felhasználó nem található!');
            }

            const price = parseInt(listing.price);
            const buyerCash = parseInt(buyer.cash);

            if (buyerCash < price) {
                throw new BadRequestException('Nincs elég pénzed!');
            }

            // 5% piaci adó
            const tax = Math.floor(price * 0.05);
            const sellerReceives = price - tax;

            // Pénzmozgás
            buyer.cash = (buyerCash - price).toString();
            seller.cash = (parseInt(seller.cash) + sellerReceives).toString();

            await manager.save(buyer);
            await manager.save(seller);

            // Tárgy átadása
            const inventory = listing.inventory;
            inventory.userId = buyerId;
            inventory.isListed = false;
            inventory.isEquipped = false;
            await manager.save(inventory);

            // Listing lezárása
            listing.isActive = false;
            await manager.save(listing);

            // Értesítés az eladónak
            this.eventsGateway.sendNotificationToUser(seller.id, {
                type: 'market_sale',
                message: `${buyer.username} megvette a ${inventory.item.name} tárgyadat ${sellerReceives} €-ért!`,
            });

            return {
                message: `Sikeresen megvetted: ${inventory.item.name}!`,
                item: inventory.item.name,
            };
        });
    }

    // Listázás visszavonása
    async cancelListing(userId: string, listingId: string): Promise<{ message: string }> {
        return await this.usersRepository.manager.transaction(async (manager) => {
            const listing = await manager.findOne(MarketListing, {
                where: { id: listingId },
                relations: ['inventory'],
                lock: { mode: 'pessimistic_write' },
            });

            if (!listing || !listing.isActive) {
                throw new NotFoundException('Listázás nem található!');
            }

            if (listing.sellerId !== userId) {
                throw new BadRequestException('Ez nem a te listázásod!');
            }

            // Inventory feloldása
            const inventory = await manager.findOne(Inventory, {
                where: { id: listing.inventoryId },
                lock: { mode: 'pessimistic_write' },
            });

            if (inventory) {
                inventory.isListed = false;
                await manager.save(inventory);
            }

            // Listing lezárása
            listing.isActive = false;
            await manager.save(listing);

            return {
                message: 'Listázás sikeresen visszavonva!',
            };
        });
    }
}
