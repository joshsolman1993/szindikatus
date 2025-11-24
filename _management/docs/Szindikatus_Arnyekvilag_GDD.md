Game Design Document (GDD) - Szindikátus: Árnyékvilág

Verzió: 1.4 (Projekt Dokumentációs Szabvánnyal bővítve)
Státusz: Tervezés

Műfaj: Persistent Browser-Based Game (PBBG) / Text RPG / Strategy

Platform: Web (Mobile-First Design)

1. Vezetői Összefoglaló (High Concept)

A Szindikátus: Árnyékvilág egy sötét hangulatú, Cyberpunk/Noir elemekkel átszőtt gengszter-szimulátor. A játékosok egyetlen célja a hatalom megszerzése egy élő, lélegző online városban. A játékmenet az erőforrás-menedzsmentre (energia/idő), a kockázatvállalásra (bűntények) és a közösségi interakcióra (klánháborúk, kereskedelem) épül.

Egyedi Értékajánlat (USP):

Valós idejű gazdaság: A feketepiaci árakat a játékosok kereslete/kínálata mozgatja.

Aszinkron PvP: Bárkit megtámadhatsz, de a következmények (vérdíj, klánháború) később érnek utol.

Modern UX: Nincs oldalújratöltés, applikáció-szerű SPA élmény.

2. Játékmechanikai Ciklus (Core Loop)

Cselekvés: A játékos energiát költ bűntények elkövetésére vagy edzésre.

Jutalom: Pénzt, tapasztalati pontot (XP) és zsákmányt szerez.

Fejlődés: A megszerzett pénzből felszerelést vesz, az XP-ből szintet lép és statisztikát növel.

Dominancia: A megnövekedett erővel más játékosokat támad meg (PvP) vagy területeket foglal el a klánjával.

Pihenés/Visszatöltés: Az energia és életerő idővel regenerálódik, ösztönözve a visszatérő játékot.

3. Karakter és Statisztikák

A játékos karaktere az alábbi numerikus értékekből áll:

3.1. Elsődleges Erőforrások (Változók)

Ezek az értékek folyamatosan fogynak és töltődnek.

Energia (Energy):

Felhasználás: Bűntények (PvE), Edzés.

Regeneráció: 5 percenként X pont (növelhető).

Bátorság (Nerve):

Felhasználás: Játékosok elleni támadás (PvP), Szervezett bűnözés (Raid).

Regeneráció: Lassabb, mint az energia.

Életerő (HP):

Csökken: Sikertelen bűntény, vesztes harc.

Hatás: Ha 0-ra csökken, a játékos "Kórházba" kerül (inaktív állapot X ideig).

Készpénz (Cash):

Funkció: Felszerelés vásárlása, tranzakciók.

Kockázat: A kéznél lévő pénz ellopható PvP-ben. A bankban lévő pénz biztonságos, de kamatozik/költsége van.

3.2. Tulajdonságok (Stats)

Ezek határozzák meg a karakter erejét. Növelhetők edzéssel (Gym) és felszereléssel.

Erő (Strength - STR): Növeli a sebzést harcban.

Védekezés / Tűrés (Tolerance - TOL): Csökkenti a kapott sebzést.

Intelligencia (Intellect - INT): Növeli a bonyolultabb (cyber) bűntények sikerességét.

Sebesség (Speed - SPD): Meghatározza, ki üt először, és növeli a találati esélyt.

4. Játékrendszerek Részletesen

4.1. Bűntények Rendszere (PvE)

A játékos listából választ bűntényt.

Képlet (Példa):
SikerEsély = (JátékosINT * 0.5 + FelszerelésBónusz) / BűntényNehézség

Kimenetelek:

Siker: Pénz, XP, esetleg tárgy (drop).

Bukás (Enyhe): Csak energiaveszteség, XP nincs.

Bukás (Súlyos): Börtön (Jail) X percre. A börtönből más játékosok kiválthatnak (pénzért) vagy kiszöktethetnek.

4.2. Harcrendszer (PvP)

Nem valós idejű, körökre osztott szimuláció, ami a szerveren fut le a másodperc töredéke alatt.

Folyamat:

Támadó kiválasztja az áldozatot (Bátorság pontba kerül).

Szerver összehasonlítja a statokat + RNG (Random Number Generator).

Győzelem:

Támadó kap XP-t.

Támadó ellopja az áldozatnál lévő készpénz 10%-át (wallet).

Áldozat HP-ja csökken, kórházba kerülhet.

Vereség:

Támadó HP-ja csökken, kórházba kerülhet.

Áldozat XP-t kap a sikeres védekezésért.

4.3. Gazdaság és Piac

NPC Piac: Alap fegyverek és védelmek fix áron.

Játékos Piac (Auction House): Ritka tárgyak adás-vétele.

Dinamikus Árak (Commodities): Tőzsde-szerű rendszer drogoknak/nyersanyagoknak.

Pl. Ha sokan adnak el "Stimulánst", az ára lemegy.

Véletlenszerű események (pl. "Rendőrségi razzia a kikötőben") felviszik az árakat.

5. Technikai Architektúra

5.1. Tech Stack

Frontend: React.js, Tailwind CSS (SPA).

Backend: Node.js (NestJS keretrendszer - KÖTELEZŐ a strukturált architektúra miatt).

Adatbázis: PostgreSQL (Felhasználói adatok, Inventory).

Cache/Session: Redis (Gyorsítótár a statisztikákhoz és sessionökhöz).

Real-time: Socket.io (Chat és Értesítések).

5.2. Adatbázis Séma (Főbb táblák vázlata)

users

id (UUID)

username (String)

password_hash (String)

email (String)

cash (BigInt)

hp (Int)

energy (Int)

nerve (Int)

stats (JSONB) -> {str: 10, int: 5, ...}

last_action_timestamp (Date)

items

id (UUID)

name (String)

type (Enum: WEAPON, ARMOR, CONSUMABLE)

effects (JSONB) -> {str_bonus: 5, damage: 10}

user_items (Inventory)

user_id (FK)

item_id (FK)

equipped (Boolean)

crimes

id (Int)

name (String)

difficulty (Int)

energy_cost (Int)

min_reward (Int)

max_reward (Int)

6. Felhasználói Felület (UI/UX) Terv

6.1. Navigációs Struktúra

Sidebar (Balra): Fő navigáció (Hírek, Bűntények, Edzőterem, Város, Kórház, Börtön, Klán).

Top Bar (Fent): Játékos státuszok (HP, Energia csíkok), Pénz, Értesítések ikon.

Content Area (Közép): Az aktuális modul tartalma.

Chat (Jobbra/Alul): Globális chat, behúzható.

6.2. Színpaletta

Háttér: #0f1115 (Dark Grey)

Elsődleges: #dc2626 (Danger Red - Harc, Akció)

Másodlagos: #eab308 (Warning Yellow - Energia, Figyelem)

Harmadlagos: #22c55e (Success Green - Pénz, Siker)

Betűtípus: 'Inter' (UI szöveg), 'Orbitron' (Címsorok, számok).

7. Fejlesztési Ütemterv (Roadmap)

Fázis 1: MVP (Minimum Viable Product)

Regisztráció/Login.

Alap statisztikák és erőforrás-töltődés.

"Bűntények" lista és végrehajtás logika.

"Edzőterem" statisztika növeléshez.

Alap Chat.

Fázis 2: Interakció

PvP Harcrendszer.

Inventory és Item Shop.

Kórház és Börtön mechanika.

Fázis 3: Közösség

Klánok (Létrehozás, csatlakozás).

Klánháborúk.

Feketepiac (Tőzsde).

9. Technikai Szabványok: Hibakezelés és Naplózás (Kiemelt Fontosságú)

Minden kódnak, amit az AI generál, követnie kell az alábbi szigorú hibakezelési protokollt a "néma hibák" és a debugolhatatlan rendszerek elkerülése érdekében.

9.1. Backend Hibakezelés (NestJS alapelvek)

Globális Exception Filter:

Kötelező implementálni egy AllExceptionsFilter-t (NestJS), ami elkap minden nem kezelt hibát.

TILOS stack trace-t küldeni a kliensnek (security risk), de KÖTELEZŐ logolni a szerver konzolra/fájlba.

Szabványosított Hiba Válasz (API Response):
Minden API hiba válasznak JSON formátumúnak kell lennie:

{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Nincs elég energiád a cselekvéshez",
  "timestamp": "2023-10-27T10:00:00.000Z",
  "path": "/api/crimes/commit",
  "correlationId": "abc-123-xyz" // Egyedi ID a logok visszakereséséhez
}


Try-Catch Blokkok Szolgáltatásokban (Services):

Minden aszinkron műveletet (Adatbázis hívás, 3rd party API) try-catch blokkba kell tenni.

A catch ágban nem csak console.error(err)-t használunk, hanem strukturált logolást.

Dobni kell egy üzleti logikának megfelelő HttpException-t (pl. BadRequestException, NotFoundException).

9.2. Strukturált Naplózás (Logging)

Sima console.log használata TILOS éles kódban.

Használj Logger könyvtárat (pl. winston vagy pino NestJS-hez).

Log formátum (JSON):

{
  "level": "error",
  "message": "Transaction failed during item purchase",
  "context": "MarketService",
  "userId": "user-uuid-123",
  "errorStack": "Error: ... at ...",
  "metadata": { "itemId": "item-uuid-999", "cost": 500 }
}


Szintek:

DEBUG: Fejlesztéshez (pl. bejövő request body).

INFO: Üzleti események (pl. "User X bought Item Y").

WARN: Nem kritikus hiba (pl. hibás login kísérlet).

ERROR: Rendszerhiba (pl. DB connection lost, crash).

9.3. Frontend Hibakezelés

Graceful Degradation: Ha egy API hívás 500-as hibát dob, az UI ne omoljon össze (fehér képernyő). Jelenjen meg egy "Toast" üzenet vagy egy fallback komponens.

ErrorBoundary: React-ben kötelező a komponens fa tetején egy ErrorBoundary használata.

Felhasználóbarát üzenetek: Soha ne írd ki a nyers szerver hibát (pl. "SQL Injection detected"). Helyette: "Hiba történt a feldolgozás során. Próbáld újra később."

10. AI Fejlesztő Utasítások: Git és Verziókezelési Protokoll (GitHub Workflow)

Ez a fejezet kötelező érvényű az AI ügynök számára. A cél a biztonságos, visszaállítható fejlesztés biztosítása iparági sztenderdek (Git) használatával.

10.1. A "Commit-First" Szabály

Bármilyen jelentős módosítás (refaktorálás, új feature, dizájn átalakítás) előtt az AI-nak ellenőriznie kell a státuszt, vagy kérnie kell a felhasználót a commitolásra.

Prompt: "Mielőtt elkezdem a [X funkció] átírását, kérlek győződj meg róla, hogy a jelenlegi működő állapotot commitoltad a Git-be! Ha valami félremegy, így egy paranccsal visszaállhatunk."

Logika: Tilos "piszkos" (uncommitted changes) munkakönyvtárban nekiállni komplex feladatnak.

10.2. Feature Branch Használata (Kockázatkezelés)

Ha az AI ügynök olyan feladatot kap, ami nagy kockázattal jár (pl. teljes UI redesign, harcrendszer csere):

Branch létrehozása: Utasítsd a felhasználót (vagy hajtsd végre, ha van terminál hozzáférés):
git checkout -b feature/harcrendszer-v2

Fejlesztés: A módosításokat ezen az ágon végezd.

Teszt: Ha a kód nem működik vagy a dizájn szétcsúszott, egyszerűen vissza lehet lépni a main ágra (git checkout main), és a projekt sértetlen marad.

Merge: Csak akkor olvaszd be (merge) a főágba, ha a fejlesztés 100%-os.

10.3. "Conventional Commits" Használata

Az AI által generált vagy javasolt commit üzeneteknek követniük kell a szabványt a könnyebb visszakövethetőség érdekében:

feat: ... - Új funkció (pl. "feat: add PvP combat logic")

fix: ... - Hibajavítás (pl. "fix: resolve energy calculation bug")

refactor: ... - Kód átírása funkció változás nélkül

style: ... - UI/CSS módosítások logika változás nélkül

10.4. Vészhelyzeti Visszaállítás (Git Reset)

Ha a fejlesztés során a kód használhatatlanná válik ("elrontott dizájn"), az AI-nak nem szabad tovább próbálkoznia a hibás kód foltozásával.

Helyes eljárás: Azonnal javasolni a visszaállást.

Parancs: git restore . (ha még nincs commitolva) vagy git reset --hard HEAD (az utolsó commithoz való visszatéréshez).

12. Projekt Dokumentációs és Követési Szabvány (Log Format)

Ahhoz, hogy a fejlesztés átlátható maradjon, az AI ügynöknek (vagy fejlesztőnek) minden nagyobb lépés után frissítenie kell a PROJEKT_NAPLO.md fájlt.

12.1. Nyelvezet és Stílus

Nyelv: KIZÁRÓLAG MAGYAR (Hungarian).

Hangnem: Tényszerű, rövid, lényegre törő.

12.2. A PROJEKT_NAPLO.md Szerkezete

A fájlnak tartalmaznia kell:

Aktuális Státusz: Hol tartunk most (pl. "Fázis 1 - Fejlesztés alatt").

Fázis Lista (Todo List): Markdown checkboxokkal jelölve a feladatokat.

[ ] Tervezett

[x] Elkészült

[~] Folyamatban / Részleges

Változásnapló (Changelog): Dátummal ellátott bejegyzések a módosításokról.

12.3. Mikor kell frissíteni?

Minden sikeres git commit után.

Minden új funkció ("feat") befejezésekor.

Ha a fejlesztési irány módosul (Roadmap update).

12.4. Státusz Ikonok

A vizuális áttekinthetőség érdekében használd ezeket az emojikat a naplóban:

🟢 KÉSZ: A funkció működik, tesztelve.

🟡 FOLYAMATBAN: Fejlesztés alatt áll.

🔴 TERVEZETT: Még nem kezdtük el.

🐛 HIBA/BUG: Ismert hiba, javításra vár.