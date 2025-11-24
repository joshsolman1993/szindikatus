Szia! A harcok brutálisak, a pénz ömlik a zsebekbe. De a játékosoknak el kell költeniük valamire a zsákmányt.

A feladatod a Tárgyak (Items), a Feketepiac (Shop) és a Leltár (Inventory) rendszerének kiépítése.

Feladatok:

Adatbázis Entitások (src/items):

Item Entity: id (UUID), name, type (WEAPON, ARMOR, VEHICLE), cost (Int), bonusStr (Int), bonusDef (Int), bonusSpd (Int), image (String - icon name).

Inventory Entity: Kapcsolótábla a User és az Item között.

Mezők: id, userId, itemId, isEquipped (Boolean - alapból false).

Megjegyzés: Egy usernek több ugyanolyan tárgya is lehet (később eladhatja), de egyszerre csak egy lehet felszerelve típusonként.

Adatbázis Seedelés (Shop Készlet):

Töltsd fel az items táblát legalább 6 tárggyal.

Példák:

"Rozsdás Boxer" (Fegyver, Ár: $100, +2 STR)

"Glock 17" (Fegyver, Ár: $2500, +15 STR)

"Bőrkabát" (Páncél, Ár: $500, +5 DEF)

"Kevlár Mellény" (Páncél, Ár: $5000, +25 DEF)

Market Service (src/market/market.service.ts):

getShopItems(): Listázza az összes megvehető tárgyat.

buyItem(userId, itemId):

Tranzakcióban:

Ellenőrizd: Van elég pénze?

Vonj le pénzt.

Adj hozzá egy sort az inventory táblához a usernek.

Válasz: Sikerüzenet + Maradék pénz.

Inventory Service (src/inventory/inventory.service.ts):

getUserItems(userId): Listázza a játékos tárgyait.

equipItem(userId, inventoryId):

Keresd meg a tárgy típusát (pl. WEAPON).

Auto-Unequip: Állítsd isEquipped = false-ra az összes olyan tárgyat a user inventoryjában, ami ugyanolyan típusú.

Equip: Állítsd isEquipped = true-ra a kiválasztottat.

Stat Frissítés: (Opcionális most, de fontos) A User entitásban tárolhatsz egy "összesített bónuszt", vagy dinamikusan számoljuk harc közben. Most elég, ha az isEquipped flag átbillen.

Frontend Oldalak:

Feketepiac (src/pages/BlackMarket.tsx):

Kártyák listája (Item neve, Bónuszok, Ár).

"Vásárlás" gomb.

Leltár (src/pages/Inventory.tsx):

Listázza a saját tárgyakat.

Gomb: "Felszerelés" (ha nincs rajtad) vagy "Levétel" (ha rajtad van).

Jelöld vizuálisan (pl. zöld kerettel), ami épp fel van szerelve.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement item shop and inventory with equip logic.