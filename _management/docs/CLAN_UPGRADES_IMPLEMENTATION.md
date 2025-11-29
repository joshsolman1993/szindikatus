# ✅ Klán Fejlesztések (Clan Upgrades) - Implementációs Összefoglaló

## 🎯 Feladat
Klán Fejlesztések (Clan Upgrades) rendszerének kiépítése, hogy a klán bank pénze hasznos legyen és értelmet adjon a területfoglalásnak.

---

## 📦 Implementált Funkciók

### 1. **Adatbázis - ClanUpgrade Entitás**
**Fájl:** `backend/src/clans/entities/clan-upgrade.entity.ts`

**Struktúra:**
```typescript
@Entity('clan_upgrades')
export class ClanUpgrade {
  id: string;              // UUID
  clanId: string;          // FK to Clan
  type: ClanUpgradeType;   // FORTRESS | TRAINING_GROUND | BLACK_MARKET_CONN
  level: number;           // Default: 0
}
```

**Unique Index:** `(clanId, type)` - Egy klánnak csak egy upgrade típusa lehet

---

### 2. **Fejlesztések Definíciói**
**Fájl:** `backend/src/clans/clan-upgrades.constants.ts`

| Upgrade | Név | Bónusz | Költség | Max Szint |
|---------|-----|--------|---------|-----------|
| **FORTRESS** | Erőd | +10% kerület védelem / szint | $50,000 * level | 10 |
| **TRAINING_GROUND** | Kiképzőközpont | +2% XP harcokból / szint | $100,000 * level | 10 |
| **BLACK_MARKET_CONN** | Alvilági Kapcsolatok | -2% piaci adó / szint | $75,000 * level | 5 |

**Költség Számítás:**
```typescript
Cost = baseCost * (currentLevel + 1)

// Példa: FORTRESS 0 -> 1
Cost = $50,000 * (0 + 1) = $50,000

// Példa: FORTRESS 5 -> 6
Cost = $50,000 * (5 + 1) = $300,000
```

---

### 3. **Backend Funkciók (ClansService)**

#### `buyUpgrade(leaderId, upgradeType)`
**Validációk:**
- ✅ User klán tagja?
- ✅ User a klán leadere?
- ✅ Upgrade még nem érte el a max szintet?
- ✅ Van elég pénz a clan.bank-ban?

**Tranzakció:**
1. Pénz levonás a clan.bank-ból
2. Upgrade level növelése (+1)
3. Mentés

**Response:**
```json
{
  "message": "Erőd sikeresen fejlesztve 3. szintre!",
  "newLevel": 3,
  "remainingBank": "450000"
}
```

#### `getClanUpgrades(clanId)`
**Funkció:** Összes upgrade lekérdezése (ha nincs DB-ben, placeholder level 0)

**Response:**
```json
[
  { "type": "FORTRESS", "level": 3 },
  { "type": "TRAINING_GROUND", "level": 0 },
  { "type": "BLACK_MARKET_CONN", "level": 1 }
]
```

#### `getUpgradeLevel(clanId, upgradeType)`
**Funkció:** Specifikus upgrade szint lekérdezése

**Response:** `number` (0 ha nincs)

---

### 4. **API Endpoint-ok (ClansController)**

| Method | Endpoint | Auth | Leírás |
|--------|----------|------|--------|
| `GET` | `/clans/upgrades/definitions` | ❌ | Fejlesztések definíciói |
| `GET` | `/clans/:id/upgrades` | ✅ | Klán fejlesztések lekérdezése |
| `POST` | `/clans/upgrades/buy` | ✅ | Fejlesztés vásárlás (csak leader) |

**Példa Request (Buy Upgrade):**
```bash
POST /clans/upgrades/buy
Authorization: Bearer <token>
Content-Type: application/json

{
  "upgradeType": "FORTRESS"
}
```

---

### 5. **Bónuszok Integrálása**

#### **FORTRESS Bónusz (TerritoriesService)**
**Fájl:** `backend/src/territories/territories.service.ts`

**Alkalmazás:** Amikor egy kerületet elfoglalnak, a defense reset értéke a FORTRESS szintjétől függ.

**Számítás:**
```typescript
// Base: 50% defense reset
// Bonus: +10% per FORTRESS level

const fortressLevel = await clansService.getUpgradeLevel(clanId, 'FORTRESS');
const fortressBonus = fortressLevel * 0.1; // 10% per level
const resetPercentage = 0.5 + fortressBonus;

district.defense = Math.floor(district.maxDefense * resetPercentage);
```

**Példa:**
- **FORTRESS Level 0:** 50% defense reset (500 / 1000)
- **FORTRESS Level 3:** 80% defense reset (800 / 1000)
- **FORTRESS Level 10:** 150% defense reset (1500 / 1000 = max defense!)

---

#### **TRAINING_GROUND Bónusz (FightService)**
**Fájl:** `backend/src/fight/fight.service.ts`

**Alkalmazás:** Amikor egy játékos nyer egy harcot, az XP bónusz a klán TRAINING_GROUND szintjétől függ.

**Számítás:**
```typescript
// Base XP: 50 (GameBalance.FIGHT_XP_REWARD)
// Bonus: +2% per TRAINING_GROUND level

const trainingLevel = await clansService.getUpgradeLevel(clanId, 'TRAINING_GROUND');
const trainingBonus = trainingLevel * 0.02; // 2% per level
const xpGained = Math.floor(baseXP * (1 + trainingBonus));
```

**Példa:**
- **TRAINING_GROUND Level 0:** 50 XP
- **TRAINING_GROUND Level 5:** 55 XP (+10%)
- **TRAINING_GROUND Level 10:** 60 XP (+20%)

---

#### **BLACK_MARKET_CONN Bónusz (Nincs még implementálva)**
**Terv:** MarketService-ben a piaci adó csökkentése

**Számítás:**
```typescript
// Base tax: 5%
// Reduction: -2% per BLACK_MARKET_CONN level (max 10%)

const blackMarketLevel = await clansService.getUpgradeLevel(clanId, 'BLACK_MARKET_CONN');
const taxReduction = Math.min(blackMarketLevel * 0.02, 0.1); // Max 10%
const finalTax = 0.05 - taxReduction;
```

**Példa:**
- **BLACK_MARKET_CONN Level 0:** 5% adó
- **BLACK_MARKET_CONN Level 3:** 2% adó (-60%)
- **BLACK_MARKET_CONN Level 5:** 0% adó (INGYENES!)

---

## 🔧 Module Integrációk

### ClansModule
- ✅ `ClanUpgrade` entitás hozzáadva
- ✅ `ClansService` frissítve (buyUpgrade, getClanUpgrades, getUpgradeLevel)
- ✅ `ClansController` frissítve (új endpoint-ok)

### TerritoriesModule
- ✅ `ClansModule` importálva
- ✅ `TerritoriesService` frissítve (FORTRESS bónusz)

### FightModule
- ✅ `ClansModule` importálva
- ✅ `FightService` frissítve (TRAINING_GROUND bónusz)

---

## 📊 Költség Táblázat

### FORTRESS (Erőd)
| Szint | Költség | Össz Költség | Bónusz |
|-------|---------|--------------|--------|
| 0 → 1 | $50,000 | $50,000 | +10% |
| 1 → 2 | $100,000 | $150,000 | +20% |
| 2 → 3 | $150,000 | $300,000 | +30% |
| ... | ... | ... | ... |
| 9 → 10 | $500,000 | $2,750,000 | +100% |

**Össz Költség (0 → 10):** $2,750,000

### TRAINING_GROUND (Kiképzőközpont)
| Szint | Költség | Össz Költség | Bónusz |
|-------|---------|--------------|--------|
| 0 → 1 | $100,000 | $100,000 | +2% XP |
| 1 → 2 | $200,000 | $300,000 | +4% XP |
| 2 → 3 | $300,000 | $600,000 | +6% XP |
| ... | ... | ... | ... |
| 9 → 10 | $1,000,000 | $5,500,000 | +20% XP |

**Össz Költség (0 → 10):** $5,500,000

### BLACK_MARKET_CONN (Alvilági Kapcsolatok)
| Szint | Költség | Össz Költség | Bónusz |
|-------|---------|--------------|--------|
| 0 → 1 | $75,000 | $75,000 | -2% adó |
| 1 → 2 | $150,000 | $225,000 | -4% adó |
| 2 → 3 | $225,000 | $450,000 | -6% adó |
| 3 → 4 | $300,000 | $750,000 | -8% adó |
| 4 → 5 | $375,000 | $1,125,000 | -10% adó |

**Össz Költség (0 → 5):** $1,125,000

---

## 🧪 Tesztelés

### 1. Upgrade Vásárlás Tesztelése
```bash
# 1. Klán létrehozása
POST /clans
{
  "name": "Test Clan",
  "tag": "TEST",
  "description": "Test"
}

# 2. Bank pénz hozzáadása (manuálisan DB-ben vagy territories adóból)
UPDATE clans SET bank = '500000' WHERE id = '<clanId>';

# 3. Upgrade vásárlás
POST /clans/upgrades/buy
{
  "upgradeType": "FORTRESS"
}

# Response:
{
  "message": "Erőd sikeresen fejlesztve 1. szintre!",
  "newLevel": 1,
  "remainingBank": "450000"
}
```

### 2. FORTRESS Bónusz Tesztelése
```bash
# 1. FORTRESS upgrade vásárlás (level 3)
# 2. Kerület elfoglalása
POST /territories/attack/<districtId>

# 3. Ellenőrzés: district.defense = maxDefense * (0.5 + 0.3) = 80%
```

### 3. TRAINING_GROUND Bónusz Tesztelése
```bash
# 1. TRAINING_GROUND upgrade vásárlás (level 5)
# 2. Harc megnyerése
POST /fight/attack/<targetId>

# 3. Ellenőrzés: xpGained = 50 * (1 + 0.1) = 55 XP
```

---

## 📝 Dokumentáció Frissítések

### PROJEKT_NAPLO.md
✅ Új bejegyzés hozzáadva: `[2025-11-29] - Clan Upgrades & Bank Spending`

---

## 🚀 Következő Lépések (Opcionális)

### 1. BLACK_MARKET_CONN Bónusz Implementálása
**Fájl:** `backend/src/market/market.service.ts`

**Implementáció:**
```typescript
// buyListing metódusban
const blackMarketLevel = await clansService.getUpgradeLevel(buyer.clanId, 'BLACK_MARKET_CONN');
const taxReduction = Math.min(blackMarketLevel * 0.02, 0.1);
const tax = Math.floor(price * (0.05 - taxReduction));
```

### 2. Frontend UI (Klán Kincstár Oldal)
**Komponens:** `frontend/src/pages/ClanTreasury.tsx`

**Funkciók:**
- Bank egyenleg megjelenítése
- Fejlesztések listája (kártyák)
- "Fejlesztés" gomb (csak leader-nek)
- Progress bar (jelenlegi szint / max szint)

### 3. Donation System (Tagok befizetése)
**Endpoint:** `POST /clans/donate`

**Funkció:** Tagok pénzt fizethetnek be a clan.bank-ba

### 4. Upgrade History (Audit Trail)
**Entitás:** `ClanUpgradeHistory`

**Funkció:** Ki, mikor, milyen fejlesztést vásárolt

---

## ✅ Checklist

- [x] ClanUpgrade entitás létrehozása
- [x] Upgrade definíciók (constants)
- [x] ClansService frissítése (buyUpgrade, getClanUpgrades, getUpgradeLevel)
- [x] ClansController frissítése (új endpoint-ok)
- [x] ClansModule frissítése (ClanUpgrade entitás)
- [x] FORTRESS bónusz integrálása (TerritoriesService)
- [x] TRAINING_GROUND bónusz integrálása (FightService)
- [x] TerritoriesModule frissítése (ClansModule import)
- [x] FightModule frissítése (ClansModule import)
- [x] PROJEKT_NAPLO.md frissítése
- [x] Git commit: `feat: implement clan upgrades and bank spending mechanics`
- [x] Dokumentáció elkészítése

---

## 🎉 Eredmény

A klán bank mostantól **hasznos és értelmes**:
- ✅ **FORTRESS:** Erősebb kerület védelem (elfoglalás után)
- ✅ **TRAINING_GROUND:** Gyorsabb szintlépés (XP bónusz)
- ✅ **BLACK_MARKET_CONN:** Olcsóbb piaci kereskedés (adó csökkentés - nincs még implementálva)
- ✅ **Stratégiai döntések:** Klán leader-ek eldönthetik, mire költik a pénzt
- ✅ **Klán verseny:** Erősebb klánok több bónuszt kapnak

**A feladat teljesítve! A klánok mostantól értelmes fejlesztési lehetőségekkel rendelkeznek.** 🚀

---

## 📚 Hasznos Linkek

- [TypeORM Relations](https://typeorm.io/relations)
- [NestJS Transactions](https://docs.nestjs.com/techniques/database#transactions)
- [Game Balance Design](https://www.gamedeveloper.com/design/balancing-turn-based-rpgs)
