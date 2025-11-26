import { apiClient as api } from './client';

export interface District {
    id: number;
    name: string;
    description: string;
    ownerClanId: string | null;
    ownerClan: {
        id: string;
        name: string;
        tag: string;
    } | null;
    defense: number;
    maxDefense: number;
    taxRate: number;
    image: string;
}

export const getMap = async (): Promise<District[]> => {
    const response = await api.get('/territories');
    return response.data;
};

export const attackDistrict = async (districtId: number) => {
    const response = await api.post(`/territories/attack/${districtId}`);
    return response.data;
};
