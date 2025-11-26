Szia! A játékosok gyűjtik az XP-t, de jelenleg a szintlépésnek nincs jutalma. Építsük ki a Szintlépés (Level Up) logikáját és a Tehetségfát (Talent Tree).

A feladatod a karakterfejlődés mélyítése.

Feladatok:

Backend - Leveling Service (src/common/services/leveling.service.ts):

XP Görbe: Készíts egy képletet a szükséges XP kiszámítására. Pl.: XP_Required = 100 * (JelenlegiSzint ^ 1.5).

CheckLevelUp: Készíts egy metódust, amit a CrimesService és FightService meghív minden XP adás után.

Jutalom: Ha User.xp >= XP_Required:

User.level növelése (+1).

User.talentPoints növelése (+1). (Ehhez adj mezőt a User entitáshoz).

Teljes gyógyulás: Energia, HP és Bátorság feltöltése 100%-ra.

eventsService.broadcast: Küldj értesítést a kliensnek ("Szintlépés!").

Backend - Talents System (src/talents):

Definíciók: Hozz létre egy fix listát (Config vagy Enum) a tehetségekről.

Tier 1:

"Utcai Bölcsesség": +5% Pénz bűntényekből.

"Vasbőr": +5% Védekezés.

"Adrenalin": +5 Max Energia.

Tier 2 (Csak 5. szinttől):

"Mesterlövész": +10% Sebzés fegyverekkel.

"Bankár": +10% Ingatlan bevétel.

UserTalents: Tárold el, mit tanult meg a user (pl. egy learnedTalents JSON tömb a User entitásban, vagy külön kapcsolótábla).

Learn Endpoint: POST /users/talents/learn: Validáld, hogy van-e pontja és megfelel-e a követelménynek (szint/előző talent).

Integráció (Bónuszok alkalmazása):

A CrimesService-ben a pénzjutalomnál vedd figyelembe az "Utcai Bölcsesség" szorzót.

A FightService-ben a sebzésnél/védelemnél vedd figyelembe a harci talenteket.

Az ingatlanoknál a "Bankár" talentet.

UI - Tehetségfa Oldal (src/pages/Talents.tsx):

Vizuális Fa: Jelenítsd meg a talenteket ikonokkal, összekötve (vagy sorokba rendezve Tier szerint).

Állapotjelzés:

Szürke: Nem elérhető.

Színes: Elérhető (van pontod + szinted).

Ragyogó/Arany: Már megtanultad.

Header: Írd ki nagyban: "Elérhető Tehetségpontok: X".

Level Up Modal: Ha a socket "Szintlépés" eseményt küld, dobj fel egy tűzijátékos/konfettis ablakot (használj react-confetti-t ha tudsz, vagy csak CSS animációt).

Navigáció:

Új menüpont a Profil alatt: "Tehetségek" (Ikon: Brain vagy Zap).

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement leveling system with talent tree and passive bonuses.