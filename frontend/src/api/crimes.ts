import { apiClient } from './client';
import type { Crime, CrimeResult } from '../types';

export const getCrimes = async (): Promise<Crime[]> => {
    const response = await apiClient.get('/crimes');
    return response.data;
};

export const commitCrime = async (crimeId: string): Promise<CrimeResult> => {
    const response = await apiClient.post(`/crimes/commit/${crimeId}`);
    return response.data;
};
