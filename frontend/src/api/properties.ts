import { apiClient as client } from './client';

export interface Property {
    id: number;
    name: string;
    cost: number;
    incomePerHour: number;
    description: string;
    imageUrl: string;
}

export interface UserProperty {
    id: string;
    propertyId: number;
    level: number;
    lastCollectedAt: string;
    property: Property;
}

export const getProperties = async () => {
    const response = await client.get<Property[]>('/properties');
    return response.data;
};

export const getMyProperties = async () => {
    const response = await client.get<UserProperty[]>('/properties/my');
    return response.data;
};

export const buyProperty = async (propertyId: number) => {
    const response = await client.post(`/properties/buy/${propertyId}`);
    return response.data;
};

export const collectIncome = async () => {
    const response = await client.post<{ collectedAmount: number; message: string }>('/properties/collect');
    return response.data;
};
