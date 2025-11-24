import { apiClient } from './client';
import type { User } from '../types';

export const getUserProfile = async (): Promise<User> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
};

export const refillEnergy = async (): Promise<void> => {
    await apiClient.post('/users/refill-energy');
};
