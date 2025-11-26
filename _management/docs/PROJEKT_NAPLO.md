📁 Projekt Napló - Szindikátus: Árnyékvilág

Utolsó frissítés: 2025. November 24.
Aktuális Fázis: 🚧 FÁZIS 1 - Alapozás (MVP)
Verzió: 0.1.0

📊 Áttekintés

Ez a dokumentum követi nyomon a játék fejlesztésének minden lépését. Az AI fejlesztőnek (vagy csapattagnak) kötelessége ezt a listát naprakészen tartani minden befejezett feladat után.

🗓️ Fejlesztési Ütemterv (Roadmap)

🏗️ FÁZIS 1: MVP (Minimum Viable Product)

Cél: Egy játszható alapverzió, ahol regisztrálni lehet, van energiarendszer és alap bűntényeket lehet elkövetni.

1.1. Rendszer Alapok (Backend)

[x] 🟢 Projekt inicializálás (Node.js, NestJS, Git repo)

[x] 🟢 Adatbázis kapcsolat kiépítése (PostgreSQL + TypeORM/Prisma)

[x] 🟢 Felhasználó regisztráció (Auth) + Jelszó hash (Argon2/Bcrypt)

[x] 🟢 Login rendszer + JWT Token generálás

[x] 🟢 Hibakezelő rendszer (Global Exception Filter) beállítása (Kritikus!)

1.2. Játékmechanika (Core Loop)

[x] 🟢 Játékos profil adatbázis séma (Cash, Energy, Stats)

[x] 🟢 Energia visszatöltődés logika (Cron job / Timestamp számítás)

[x] 🟢 "Bűntények" adatbázis tábla feltöltése (Seed data)

[x] 🟢 Bűntény elkövetése logika (API Endpoint: /crimes/commit)

[x] 🟢 Siker/Bukás kalkuláció

[x] 🟢 Jutalom jóváírása (Tranzakcióban!)

1.3. Frontend (Kliens)

[x] 🟢 Prototípus: Dashboard UI Design (React + Tailwind)

[x] 🟢 Prototípus: Landing Page UI Design

[x] 🟢 React App inicializálás + Routing beállítása

[x] 🟢 API kommunikációs réteg (Axios/Fetch interceptorokkal)

[x] 🟢 Bejelentkezés/Regisztráció űrlapok bekötése

⚔️ FÁZIS 2: Interakció és Harc

Cél: A játékosok közötti konfliktus megteremtése.

[ ] 🔴 Más játékosok listázása / Kereső

[ ] 🔴 Harcrendszer motorjának megírása (Szimuláció)

[ ] 🔴 PvP API végpontok

[ ] 🔴 Inventory rendszer alapjai (Database)

[ ] 🔴 Item Shop (Bolt) felület

🏢 FÁZIS 3: Gazdaság és Közösség

Cél: Hosszú távú játékélmény biztosítása.

[ ] 🔴 Klán rendszer (Létrehozás, Meghívás)

[ ] 🔴 Valós idejű Chat (Socket.io)

📁 Projekt Napló - Szindikátus: Árnyékvilág

Utolsó frissítés: 2025. November 24.
Aktuális Fázis: 🚧 FÁZIS 1 - Alapozás (MVP)
Verzió: 0.1.0

📊 Áttekintés

Ez a dokumentum követi nyomon a játék fejlesztésének minden lépését. Az AI fejlesztőnek (vagy csapattagnak) kötelessége ezt a listát naprakészen tartani minden befejezett feladat után.

🗓️ Fejlesztési Ütemterv (Roadmap)

🏗️ FÁZIS 1: MVP (Minimum Viable Product)

Cél: Egy játszható alapverzió, ahol regisztrálni lehet, van energiarendszer és alap bűntényeket lehet elkövetni.

1.1. Rendszer Alapok (Backend)

[x] 🟢 Projekt inicializálás (Node.js, NestJS, Git repo)

[x] 🟢 Adatbázis kapcsolat kiépítése (PostgreSQL + TypeORM/Prisma)

[x] 🟢 Felhasználó regisztráció (Auth) + Jelszó hash (Argon2/Bcrypt)

[x] 🟢 Login rendszer + JWT Token generálás

[x] 🟢 Hibakezelő rendszer (Global Exception Filter) beállítása (Kritikus!)

1.2. Játékmechanika (Core Loop)

[x] 🟢 Játékos profil adatbázis séma (Cash, Energy, Stats)

[x] 🟢 Energia visszatöltődés logika (Cron job / Timestamp számítás)

[x] 🟢 "Bűntények" adatbázis tábla feltöltése (Seed data)

[x] 🟢 Bűntény elkövetése logika (API Endpoint: /crimes/commit)

[x] 🟢 Siker/Bukás kalkuláció

[x] 🟢 Jutalom jóváírása (Tranzakcióban!)

1.3. Frontend (Kliens)

[x] 🟢 Prototípus: Dashboard UI Design (React + Tailwind)

[x] 🟢 Prototípus: Landing Page UI Design

[x] 🟢 React App inicializálás + Routing beállítása

[x] 🟢 API kommunikációs réteg (Axios/Fetch interceptorokkal)

[x] 🟢 Bejelentkezés/Regisztráció űrlapok bekötése

⚔️ FÁZIS 2: Interakció és Harc

Cél: A játékosok közötti konfliktus megteremtése.
🎨 **Design:** Legutóbbi események (Activity Feed) oldalsávban sticky pozícióval.
Technikai: UserProperty kapcsolótábla, 24 órás bevétel limit (cap).

[0.3.0] - 2025-11-26

Performance: Adatbázis indexek hozzáadva (User: xp, cash, username, clanId; Clan: leaderId).
Performance: Query optimalizálás (UsersService) - csak a szükséges mezők lekérése.
Technikai: Redis Cache előkészület (TODO) a ranglistákhoz.

[0.2.9] - 2025-11-26

Technikai: Race Condition javítások (Pessimistic Locking).
Technikai: MarketService, CrimesService, FightService, UsersService, PropertiesService tranzakciók védelme.
Technikai: Deadlock elkerülés a FightService-ben ID alapú rendezéssel.

[0.2.8] - 2025-11-26

Feature: Mobil Navigáció (Hamburger Menü) javítása.
Feature: Skeleton Loading állapotok bevezetése (Dashboard, Crimes, The Streets).
UI: DashboardLayout - Mobil menü backdrop-al, drawer animációval.
UI: Skeleton komponens létrehozása.
UI: StatCardSkeleton, CrimeCardSkeleton, PlayerCardSkeleton implementálása.

[0.2.7] - 2025-11-25

Feature: Kaszinó (Casino) modul implementálva.
Feature: CasinoService - Pénzfeldobás (Coinflip) és Nyerőgép (Slots) logika.
Feature: Backend API - /casino/coinflip és /casino/spin végpontok.
Feature: Frontend CasinoPage - 3D animált pénzfeldobás és pörgetés.
Feature: UI integráció - Kaszinó menüpont a Dashboard-on.
Technikai: useGameSound integráció hangeffektekhez, framer-motion animációk.

[0.2.6] - 2025-11-25

**Feature:** Design System Polish - Egységes vizuális megjelenés és cyberpunk esztétika.
🎨 **Stílus:** Google Fonts integráció (Inter, Orbitron betűtípusok).
🎨 **Stílus:** Szemantikus színek definiálva (primary, secondary, success, dark-900/800/700).
🎨 **Stílus:** Custom button osztályok (.btn-primary, .btn-secondary, .btn-ghost) neon glow effekttel.
🎨 **Stílus:** .glass-panel utility osztály egységes kártyák számára.
🎨 **Stílus:** .neon-text és .neon-text-secondary osztályok fénylő szövegekhez.
✨ **Animáció:** fade-in és slide-in-up animációk implementálva.
✨ **Animáció:** Staggered delays (késleltetett) animációk a Dashboard-on.
🔧 **Refactor:** Button komponens egyszerűsítve design system osztályokkal.
🔧 **Refactor:** StatCard, CrimeCard komponensek glass-panel osztállyal.
🔧 **Refactor:** DashboardLayout - SZINDIKÁTUS címsor neon effekttel.
🔧 **Refactor:** DashboardPage - StatCard-ok sima animált betöltéssel.

[0.2.5] - 2025-11-24

Feature: Ranglista (Leaderboard) rendszer.
Feature: XP (Tapasztalati pont) hozzáadása User entitáshoz, XP jutalmazás harcokban.
Feature: LeaderboardService - Top 50 játékos XP és cash alapján, Top 50 banda össz-XP alapján.
Feature: Frontend LeaderboardPage - Fülek: Legerősebbek, Leggazdagabbak, Top Bandák.
Feature: Kiemelés: Saját játékos/banda highlighting, Top 3 medal ikonok.

[0.2.4] - 2025-11-24

Feature: Klán rendszer (Clan System).
Feature: ClansService - Létrehozás (pénzbe kerül), Csatlakozás, Kilépés.
Feature: Backend entitások (Clan) és User bővítés (clanId, clanRank).
Feature: Frontend ClansPage - Banda alapítás, lista, saját banda nézet.
Feature: UI integráció - Banda tag megjelenítése a játékos listában.

[0.2.3] - 2025-11-24

Feature: Valós idejű Chat és Rendszerüzenetek (Live Feed).
Feature: WebSocket Gateway (ChatGateway) JWT hitelesítéssel.
Feature: EventsService - rendszerüzenetek broadcastolása (pl. nagy rablások).
Feature: Frontend ChatWidget komponens (Chat és Hírek fülek).
Feature: useSocket hook a kapcsolat kezelésére.

[0.2.2] - 2025-11-24

Feature: Felszerelés integráció (Equipment Integration).
Feature: UsersService.calculateCombatStats - felszerelés bónuszok számítása.
Feature: FightService - harc közben felszerelés bónuszok figyelembe vétele.
Feature: UsersController - profil és játékos lista API bővítése computed statokkal.
UI: Dashboard - Harci statisztikák megjelenítése bónuszokkal.
UI: The Streets - Becsült erő tartalmazza a felszerelést.

[0.2.1] - 2025-11-24

Feature: Item Shop (Feketepiac) és Inventory rendszer.
Feature: Item és Inventory entitások, MarketService, InventoryService.
Feature: Vásárlás (tranzakcióban), Felszerelés/Levétel logika.
UI: BlackMarketPage - shop items, vásárlás.
UI: InventoryPage - leltár lista, felszerelés kezelése.
Technikai: Auto-unequip ugyanolyan típusú tárgyaknál.

[0.2.0] - 2025-11-24

Feature: PvP Harcrendszer (Combat System) implementálva.
Feature: FightService - Validáció, Szimuláció, Végrehajtás (tranzakcióban).
Feature: Pénz rablás (10%), XP jutalm

ak, HP változások.
UI: CombatResultModal - részletes győzelem/vereség visszajelzés.
Technikai: FIGHT_NERVE_COST, damage/reward konstansok.

[0.1.9] - 2025-11-24

Feature: "Az Utca" (The Streets) - Játékos lista implementálva.
Feature: PublicUserDto biztonságos adatkezeléshez (nincs jelszó, email).
Feature: Avatar generálás DiceBear API-val.
Feature: Keresőmező játékosok szűréséhez.
UI: PlayerCard komponens, Támadás gomb (placeholder).
Technikai: findAllExcept metódus (utolsó 50 aktív játékos).

[0.1.8] - 2025-11-24

Feature: Konditerem (Gym) rendszer implementálva.
Feature: Statisztika edzés (Erő, Állóképesség, Intelligencia, Gyorsaság).
Technikai: Tranzakciós JSONB update, energia ellenőrzés.
UI: Gym oldal 4 kártyával, Toast feedback, Navigation sidebar.

[0.1.7] - 2025-11-24

Feature:[x] 🟢 Dashboard Layout komponensek (Sidebar, Resource Bars).
Feature:[x] 🟢 Bűntények UI oldal (Lista, Végrehajtás gomb, Toast feedback).
Feature: Dev eszközök (Energia töltés gomb Dashboard-on).
Technikai: Modularis UI komponensek, Típusdefiníciók, API réteg kibővítése.

Feature: Auth Context és API kliens (Axios Interceptors).
Feature: UI Alapok (Landing, Login, Register, Dashboard).

[0.1.5] - 2025-11-24

Feature: Energia és Bátorság visszatöltődés (Cron Job).
Feature: Fejlesztői eszközök (Energia újratöltés API).
Technikai: CommonModule és ScheduleModule integrálva.

[0.1.4] - 2025-11-24

Feature: Bűntények (Crimes) modul implementálva.
Feature: Adatbázis seedelés (5 alap bűntény).
Feature: Tranzakcionális bűntény végrehajtás (Energia levonás, Pénz jóváírás).

[0.1.3] - 2025-11-24

Feature: Teljes Auth rendszer (Regisztráció, Login, JWT).
Feature: Jelszó hashelés (Bcrypt) és validáció (Class-Validator).
Technikai: Users és Auth modulok implementálva.

[0.1.2] - 2025-11-24

Technikai: Adatbázis kapcsolat konfigurálva (TypeORM).
Technikai: Globális hibakezelő (AllExceptionsFilter) implementálva.
Feature: User entitás és GameBalance config létrehozva.

[0.1.1] - 2025-11-24

Technikai: Docker környezet (Postgres, Redis) létrehozva.
Technikai: Backend (NestJS) inicializálva, TypeORM telepítve.

[0.1.0] - 2023-10-27

Hozzáadva: Szindikatus_Arnyekvilag_GDD.md (Design Dokumentáció) létrehozása.

Hozzáadva: PROJEKT_NAPLO.md (Ez a fájl) a követéshez.

Design: Elkészült a Dashboard és Landing Page HTML/React prototípusa.

Szabvány: Bevezetve a Git "Anti-Regression" és "Safe-Refactor" protokoll.

⚠️ Ismert Hibák (Bugs)

Jelenleg nincsenek ismert hibák a tervezési fázisban.