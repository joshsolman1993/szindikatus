import { apiClient } from './client';

export interface ShopItem {
    id: string;
    name: string;
    type: string;
    cost: number;
    bonusStr: number;
    bonusDef: number;
    bonusSpd: number;
    image: string;
}

export interface InventoryItem {
    id: string;
    userId: string;
    itemId: string;
    isEquipped: boolean;
    isListed?: boolean; // Optional field for marketplace listing status
    item: ShopItem;
    createdAt: string;
}

export const getShopItems = async (): Promise<ShopItem[]> => {
    const response = await apiClient.get('/market/shop');
    return response.data;
};

export const buyItem = async (itemId: string): Promise<any> => {
    const response = await apiClient.post(`/market/buy/${itemId}`);
    return response.data;
};

export const getUserInventory = async (): Promise<InventoryItem[]> => {
    const response = await apiClient.get('/inventory');
    return response.data;
};

export const equipItem = async (inventoryId: string): Promise<any> => {
    const response = await apiClient.post(`/inventory/equip/${inventoryId}`);
    return response.data;
};

// ==================== PLAYER MARKETPLACE ====================

export interface MarketListing {
    id: string;
    sellerId: string;
    seller: {
        id: string;
        username: string;
    };
    inventoryId: string;
    inventory: InventoryItem;
    price: string;
    createdAt: string;
    isActive: boolean;
}

export const getMarketListings = async (): Promise<MarketListing[]> => {
    const response = await apiClient.get('/market/listings');
    return response.data;
};

export const getMyListings = async (): Promise<MarketListing[]> => {
    const response = await apiClient.get('/market/my-listings');
    return response.data;
};

export const createListing = async (inventoryId: string, price: string): Promise<MarketListing> => {
    const response = await apiClient.post('/market/create-listing', { inventoryId, price });
    return response.data;
};

export const buyListing = async (listingId: string): Promise<any> => {
    const response = await apiClient.post(`/market/buy-listing/${listingId}`);
    return response.data;
};

export const cancelListing = async (listingId: string): Promise<any> => {
    const response = await apiClient.post(`/market/cancel-listing/${listingId}`);
    return response.data;
};
