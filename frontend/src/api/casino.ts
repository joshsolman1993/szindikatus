import { apiClient as client } from './client';

export const coinflip = async (amount: number, choice: 'head' | 'tail') => {
    const response = await client.post('/casino/coinflip', { amount, choice });
    return response.data;
};

export const spin = async (amount: number) => {
    const response = await client.post('/casino/spin', { amount });
    return response.data;
};
