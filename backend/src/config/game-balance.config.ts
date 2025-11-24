export const GameBalance = {
    // Játékos kezdeti értékei
    INITIAL_ENERGY: 100,
    MAX_ENERGY: 100,

    INITIAL_CASH: 1000, // Kezdő tőke

    INITIAL_HP: 100,
    MAX_HP: 100,

    INITIAL_NERVE: 10, // Bátorság (PvP-hez)
    MAX_NERVE: 10,

    // Kezdő statisztikák
    INITIAL_STATS: {
        str: 10, // Erő
        tol: 10, // Tűrés
        int: 10, // Intelligencia
        spd: 10, // Sebesség
    },

    // Edzőterem költségek
    GYM_ENERGY_COST: 10, // Energia költség edzéshez

    // Harc (Fight) rendszer
    FIGHT_NERVE_COST: 2, // Bátorság költség támadáshoz
    FIGHT_MIN_HP_TO_ATTACK: 10, // Minimum HP támadáshoz
    FIGHT_CASH_STEAL_PERCENTAGE: 0.1, // Készpénz 10%-a
    FIGHT_WIN_ATTACKER_DAMAGE: 5, // HP veszteség győzelem esetén
    FIGHT_WIN_DEFENDER_DAMAGE: 30, // HP veszteség vereség esetén
    FIGHT_LOSE_ATTACKER_DAMAGE: 20, // HP veszteség vereség esetén
    FIGHT_XP_REWARD: 20, // XP jutalom
};
