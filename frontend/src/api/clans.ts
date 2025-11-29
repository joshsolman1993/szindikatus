import { apiClient } from './client';

export interface Clan {
    id: string;
    name: string;
    tag: string;
    description: string;
    leaderId: string;
    members?: any[];
    createdAt: string;
}

export const getClans = async (): Promise<Clan[]> => {
    const response = await apiClient.get('/clans');
    return response.data;
};

export const getClanDetails = async (id: string): Promise<Clan> => {
    const response = await apiClient.get(`/clans/${id}`);
    return response.data;
};

export const createClan = async (data: { name: string; tag: string; description?: string }): Promise<Clan> => {
    const response = await apiClient.post('/clans', data);
    return response.data;
};

export const joinClan = async (id: string): Promise<any> => {
    const response = await apiClient.post(`/clans/${id}/join`);
    return response.data;
};

export const leaveClan = async (): Promise<any> => {
    const response = await apiClient.post('/clans/leave');
    return response.data;
};
