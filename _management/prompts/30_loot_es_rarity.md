Szia! A piac üzemel, de a kínálat egyhangú. Dobjuk fel a játékot Egyedi Tárgyakkal és Ritkasági Rendszerrel (Rarity & Loot).

A feladatod, hogy a tárgyaknak legyen minősége, és bűntények során lehessen találni őket.

Feladatok:

Adatbázis - Inventory Bővítése (src/items/entities/inventory.entity.ts):

Ne a Item táblát módosítsd (az maradjon a "tervrajz"), hanem a konkrét példányt az Inventory-ban!

Új mezők:

rarity: Enum (COMMON, UNCOMMON, RARE, EPIC, LEGENDARY). Default: COMMON.

quality: Float (0.8 - 1.5). Default: 1.0. Ez a szorzó a statokra.

creationDate: Date (mikor találták/craftolták).

Loot Service Létrehozása (src/items/loot.service.ts):

generateLoot(baseItemId: string, userId: string):

RNG (Szerencse): Dobj egy számot 0-100 között.

0-60: COMMON (szorzó: 1.0)

60-85: UNCOMMON (szorzó: 1.1)

85-95: RARE (szorzó: 1.25)

95-99: EPIC (szorzó: 1.5)

100: LEGENDARY (szorzó: 2.0!)

Létrehoz egy Inventory bejegyzést a kiszámolt rarity és quality értékekkel.

Integráció - Bűntények (src/crimes/crimes.service.ts):

A commitCrime metódusban, ha a bűntény sikeres:

Legyen egy kis esély (pl. 5-10%) tárgy dobásra (dropChance).

Ha dob: Válassz egy random tárgyat az adatbázisból (vagy a bűntényhez rendelt loot table-ből), és hívd meg a lootService.generateLoot-ot.

Visszajelzés: A válaszban (CrimeResult) küldd vissza a talált tárgy adatait is ("Találtál egy RITKA Baseball ütőt!").

Stat Számítás Frissítése (src/users/users.service.ts):

A calculateCombatStats metódust módosítsd!

A felszerelt tárgy bónuszát szorozd meg a tárgy quality értékével.

Képlet: ActualBonus = BaseBonus * InventoryItem.quality.

UI - Megjelenítés (src/components/items/ItemCard.tsx vagy InventoryPage):

Színkódolás: A tárgy neve vagy kerete legyen színes a ritkaság szerint:

Common: Szürke

Uncommon: Zöld

Rare: Kék

Epic: Lila

Legendary: Narancs/Arany (és esetleg pulzáló animáció).

Statok: Írd ki a megnövelt értékeket (pl. "Erő: +10 (+2)" zölddel), hogy lássa a játékos, ez egy jó példány.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement item rarity system and random loot drops from crimes.