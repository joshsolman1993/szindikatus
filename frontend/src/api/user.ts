import { apiClient } from './client';
import type { User } from '../types';

export const getUserProfile = async (): Promise<User> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
};

export const refillEnergy = async (): Promise<void> => {
    await apiClient.post('/users/refill-energy');
};

export const trainStat = async (stat: string): Promise<any> => {
    const response = await apiClient.post('/users/train', { stat });
    return response.data;
};
