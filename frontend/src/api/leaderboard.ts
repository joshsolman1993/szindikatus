import { apiClient } from './client';
import type { PublicUser } from './users';

export interface ClanLeaderboardItem {
    id: string;
    name: string;
    tag: string;
    memberCount: string; // Raw query returns string for count
    totalXp: string; // Raw query returns string for sum
}

export const getTopPlayers = async (): Promise<PublicUser[]> => {
    const response = await apiClient.get('/leaderboard/players');
    return response.data;
};

export const getRichestPlayers = async (): Promise<PublicUser[]> => {
    const response = await apiClient.get('/leaderboard/rich');
    return response.data;
};

export const getTopClans = async (): Promise<ClanLeaderboardItem[]> => {
    const response = await apiClient.get('/leaderboard/clans');
    return response.data;
};
