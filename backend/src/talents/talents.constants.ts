export enum TalentId {
  STREET_WISDOM = 'street_wisdom',
  IRON_SKIN = 'iron_skin',
  ADRENALINE = 'adrenaline',
  SHARPSHOOTER = 'sharpshooter',
  BANKER = 'banker',
}

export interface TalentDefinition {
  id: TalentId;
  name: string;
  description: string;
  tier: number;
  requiredLevel: number;
  requiredTalentId?: TalentId;
  bonus: {
    type:
      | 'money_multiplier'
      | 'defense_multiplier'
      | 'max_energy'
      | 'damage_multiplier'
      | 'property_income_multiplier';
    value: number;
  };
}

export const TALENTS: Record<TalentId, TalentDefinition> = {
  [TalentId.STREET_WISDOM]: {
    id: TalentId.STREET_WISDOM,
    name: 'Utcai Bölcsesség',
    description: '+5% Pénz bűntényekből',
    tier: 1,
    requiredLevel: 1,
    bonus: { type: 'money_multiplier', value: 0.05 },
  },
  [TalentId.IRON_SKIN]: {
    id: TalentId.IRON_SKIN,
    name: 'Vasbőr',
    description: '+5% Védekezés',
    tier: 1,
    requiredLevel: 1,
    bonus: { type: 'defense_multiplier', value: 0.05 },
  },
  [TalentId.ADRENALINE]: {
    id: TalentId.ADRENALINE,
    name: 'Adrenalin',
    description: '+5 Max Energia',
    tier: 1,
    requiredLevel: 1,
    bonus: { type: 'max_energy', value: 5 },
  },
  [TalentId.SHARPSHOOTER]: {
    id: TalentId.SHARPSHOOTER,
    name: 'Mesterlövész',
    description: '+10% Sebzés fegyverekkel',
    tier: 2,
    requiredLevel: 5,
    bonus: { type: 'damage_multiplier', value: 0.1 },
  },
  [TalentId.BANKER]: {
    id: TalentId.BANKER,
    name: 'Bankár',
    description: '+10% Ingatlan bevétel',
    tier: 2,
    requiredLevel: 5,
    bonus: { type: 'property_income_multiplier', value: 0.1 },
  },
};
