Szia! A játékvilág teljes, de a játékosoknak irányításra van szükségük. Építsük ki a Küldetés Rendszert (Mission System), ami napi feladatokat és karrier célokat ad.

Feladatok:

Adatbázis Entitások (src/missions):

Mission Entity:

id, title (pl. "Bemelegítés"), description.

type (Enum: DAILY, STORY).

requirementType (Enum: CRIME, FIGHT_WIN, GYM_TRAIN, LEVEL_UP).

requirementValue (Int - pl. 5 db).

rewardCash, rewardXp, rewardDiamonds (új prémium valuta, vagy sima cash).

UserMission Entity: (Kapcsolótábla a progress követésére)

userId, missionId.

progress (Int - jelenlegi állás).

isCompleted (Boolean).

isClaimed (Boolean - felvette-e a jutalmat).

Seedelés (Példa Küldetések):

Napi:

"Kispályás Bűnöző": Kövess el 10 bűntényt.

"Utcai Harcos": Nyerj 3 PvP csatát.

"Gyúrós": Használd a konditermet 5-ször.

Sztori:

"Kezdetek": Érd el a 2. szintet.

"Első vér": Nyerj 1 PvP csatát.

Missions Service (src/missions/missions.service.ts):

Progress Tracking (trackProgress):

Ezt a metódust fogják hívni más service-ek.

Input: userId, type (pl. FIGHT_WIN), amount (pl. 1).

Logika: Keresd meg a user aktív küldetéseit, amik ilyen típusúak. Növeld a progress-t. Ha eléri a requirementValue-t, állítsd isCompleted = true-ra, és küldj Socket értesítést ("Küldetés Kész!").

Claim Reward (claimReward):

Ha isCompleted de !isClaimed: Add oda a jutalmat (Pénz/XP), és állítsd isClaimed = true-ra.

Daily Reset (Cron):

Éjfélkor (@Cron('0 0 * * *')) töröld a DAILY típusú UserMission rekordokat (vagy reseteld őket), hogy újra meg lehessen csinálni.

Integráció (Hooking):

CrimesService: Sikeres bűntény után -> missionsService.trackProgress(user.id, 'CRIME', 1).

FightService: Győzelem után -> missionsService.trackProgress(user.id, 'FIGHT_WIN', 1).

LevelingService: Szintlépés után -> missionsService.trackProgress(..., 'LEVEL_UP', level).

UI - Küldetések Oldal (src/pages/Missions.tsx):

Fülek: "Napi Küldetések" | "Karrier".

Mission Card:

Cím, Leírás.

Progress Bar: (pl. 3/5).

Jutalom: Ikonokkal (Pénz, XP).

Gomb:

"Folyamatban" (Szürke, Disabled).

"Jutalom Felvétele" (Zöld, Aktív, ha Kész).

"Teljesítve" (Halvány, ha már felvette).

Navigáció:

Új menüpont: "Küldetések" (Ikon: ClipboardList vagy Target).

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement daily and story mission system with progress tracking.