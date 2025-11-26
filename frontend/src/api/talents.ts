import { apiClient } from './client';

export interface Talent {
    id: string;
    name: string;
    description: string;
    tier: number;
    requiredLevel: number;
    requiredTalentId?: string;
    bonus: {
        type: string;
        value: number;
    };
}

export const getTalents = async (): Promise<Talent[]> => {
    const response = await apiClient.get('/users/talents');
    return response.data;
};

export const learnTalent = async (talentId: string): Promise<{ success: boolean; learnedTalents: string[]; talentPoints: number }> => {
    const response = await apiClient.post('/users/talents/learn', { talentId });
    return response.data;
};
