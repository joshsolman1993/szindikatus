import { apiClient as api } from './client';

export interface Mission {
    id: number;
    title: string;
    description: string;
    type: 'DAILY' | 'STORY';
    requirementType: 'CRIME' | 'FIGHT_WIN' | 'GYM_TRAIN' | 'LEVEL_UP';
    requirementValue: number;
    rewardCash: number;
    rewardXp: number;
    rewardDiamonds: number;
}

export interface UserMission {
    id: number;
    userId: string;
    missionId: number;
    mission: Mission;
    progress: number;
    isCompleted: boolean;
    isClaimed: boolean;
}

export const getMissions = async (): Promise<UserMission[]> => {
    const response = await api.get('/missions');
    return response.data;
};

export const claimMissionReward = async (userMissionId: number) => {
    const response = await api.post(`/missions/claim/${userMissionId}`);
    return response.data;
};
