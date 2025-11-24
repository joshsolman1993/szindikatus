export interface User {
    id: string;
    username: string;
    email: string;
    cash: string;
    energy: number;
    nerve: number;
    hp: number;
    maxEnergy?: number;
    maxNerve?: number;
    maxHp?: number;
    stats?: {
        str: number;
        tol: number;
        int: number;
        spd: number;
    };
}

export interface Crime {
    id: string;
    name: string;
    description: string;
    energyCost: number;
    difficulty: number;
    minReward: string;
    maxReward: string;
    successRate: number;
}

export interface CrimeResult {
    success: boolean;
    moneyGained: string;
    message: string;
    newEnergy: number;
    newCash: string;
}
