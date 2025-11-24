import { apiClient } from './client';

export interface FightResult {
    winner: boolean;
    moneyStolen: number;
    xpGained: number;
    damageDealt: number;
    damageTaken: number;
    logs: string[];
}

export const attackPlayer = async (targetId: string): Promise<FightResult> => {
    const response = await apiClient.post(`/fight/attack/${targetId}`);
    return response.data;
};
