Szia! A bandák megalakultak, a háború elkezdődött. De senki nem tudja, ki áll nyerésre. Építsük meg a Ranglistát (Leaderboard)!

A feladatod a globális statisztikák és rangsorok megjelenítése.

Feladatok:

Backend - Leaderboard Service (src/users/users.service.ts és src/clans/clans.service.ts):

Játékos Rangsor (getTopPlayers):

Kérd le az adatbázisból a Top 50 játékost.

Rendezési elv: XP (Tapasztalati pont) szerint csökkenő sorrendben.

Ha két játékosnak ugyanannyi XP-je van, a regisztráció dátuma döntsön (a régebbi előrébb).

Használd a PublicUserDto-t a válaszhoz!

Gazdagsági Rangsor (getRichestPlayers):

Top 50 játékos cash (Készpénz) alapján.

Banda Rangsor (getTopClans):

Ez egy kicsit trükkösebb SQL query (vagy TypeORM QueryBuilder).

Rendezd a bandákat a tagjaik összesített XP-je (Total XP) alapján.

Válasz mezők: Helyezés, Banda Név, Tag, Tagok száma, Összesített XP.

API Végpontok (src/leaderboard/leaderboard.controller.ts):

Hozz létre egy új kontrollert a tiszta struktúra érdekében.

GET /leaderboard/players: XP alapú lista.

GET /leaderboard/rich: Pénz alapú lista.

GET /leaderboard/clans: Banda lista.

Frontend API (src/api/leaderboard.ts):

Implementáld a fenti lekérdezéseket.

UI - Ranglista Oldal (src/pages/Leaderboard.tsx):

Készíts egy oldalt fülekkel (Tabs): "Legerősebbek", "Leggazdagabbak", "Top Bandák".

Táblázat (Table) Nézet:

Oszlopok: #Helyezés, Avatar (kicsi), Név [Klán Tag], Érték (XP vagy Pénz).

Kiemelés: Ha a bejelentkezett felhasználó (vagy bandája) szerepel a listán, emeld ki a sort (pl. sárga háttérrel).

Top 3: Az első három helyezettet jelöld meg speciális ikonokkal (🥇, 🥈, 🥉) vagy színekkel (Arany, Ezüst, Bronz).

Navigáció:

Add hozzá a "Ranglista" menüpontot a Sidebarhoz (Ikon: Trophy vagy BarChart).

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement global leaderboards for players and clans.