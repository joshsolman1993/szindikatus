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
