import { apiClient } from './client';

export interface PublicUser {
    id: string;
    username: string;
    avatarUrl: string;
    totalStats: number;
    clanTag?: string;
    xp?: number;
    cash?: string;
}

export const getPlayers = async (): Promise<PublicUser[]> => {
    const response = await apiClient.get('/users');
    return response.data;
};

export const updateProfile = async (payload: { bio?: string; settings?: { soundEnabled?: boolean } }) => {
    const response = await apiClient.patch('/users/profile', payload);
    return response.data;
};
