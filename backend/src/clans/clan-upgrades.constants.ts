import { ClanUpgradeType } from './entities/clan-upgrade.entity';

export interface UpgradeDefinition {
    type: ClanUpgradeType;
    name: string;
    description: string;
    baseCost: number; // Base cost multiplied by level
    maxLevel: number;
    bonus: string; // Description of the bonus
}

export const CLAN_UPGRADES: Record<ClanUpgradeType, UpgradeDefinition> = {
    [ClanUpgradeType.FORTRESS]: {
        type: ClanUpgradeType.FORTRESS,
        name: 'Erőd',
        description: 'Minden kerület védelmét növeli +10%-kal szintenként.',
        baseCost: 50000,
        maxLevel: 10,
        bonus: '+10% defense per level',
    },
    [ClanUpgradeType.TRAINING_GROUND]: {
        type: ClanUpgradeType.TRAINING_GROUND,
        name: 'Kiképzőközpont',
        description: 'Minden klántag +2% XP-t kap harcokból szintenként.',
        baseCost: 100000,
        maxLevel: 10,
        bonus: '+2% XP per level',
    },
    [ClanUpgradeType.BLACK_MARKET_CONN]: {
        type: ClanUpgradeType.BLACK_MARKET_CONN,
        name: 'Alvilági Kapcsolatok',
        description: '-2% piaci adó szintenként (max 10%).',
        baseCost: 75000,
        maxLevel: 5,
        bonus: '-2% market tax per level',
    },
};

/**
 * Calculate upgrade cost based on level
 * Formula: baseCost * (level + 1)
 */
export function calculateUpgradeCost(type: ClanUpgradeType, currentLevel: number): number {
    const definition = CLAN_UPGRADES[type];
    return definition.baseCost * (currentLevel + 1);
}

/**
 * Get fortress defense bonus (percentage)
 * Formula: level * 10%
 */
export function getFortressDefenseBonus(level: number): number {
    return level * 0.1; // 10% per level
}

/**
 * Get training ground XP bonus (percentage)
 * Formula: level * 2%
 */
export function getTrainingGroundXPBonus(level: number): number {
    return level * 0.02; // 2% per level
}

/**
 * Get black market tax reduction (percentage)
 * Formula: level * 2% (max 10%)
 */
export function getBlackMarketTaxReduction(level: number): number {
    return Math.min(level * 0.02, 0.1); // 2% per level, max 10%
}
