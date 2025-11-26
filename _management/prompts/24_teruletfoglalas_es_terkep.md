Szia! A karakterek készen állnak, a bandák megalakultak. Itt az ideje, hogy felosszák egymás között a várost. Építsük ki a Térkép és Területfoglalás (Territory Wars) rendszert.

A feladatod a városi körzetek létrehozása és a harci mechanika implementálása a klánok között.

Feladatok:

Adatbázis Entitások (src/territories):

District Entity:

id (Int), name (String), description (String).

ownerClanId (UUID, nullable) - Ki birtokolja épp?

defense (Int) - Jelenlegi védelmi pontok (HP).

maxDefense (Int) - Maximális védelem (fejleszthető).

taxRate (Float) - Adóbevétel szorzó (pl. 0.05 = 5%).

image (String) - Háttérkép a kerülethez.

Seedelés (A Város Felosztása):

Hozz létre 6-8 kerületet változó nehézséggel:

"Kikötő" (Könnyű, kis adó)

"Ipari Zóna"

"Vöröslámpás Negyed"

"Pénzügyi Központ" (Nehéz, hatalmas adó)

"Fellegvár" (A legnehezebb)

Territory Service (src/territories/territories.service.ts):

getMap(): Listázza a kerületeket és a tulajdonosokat.

attackDistrict(userId, districtId):

Validáció: A user legyen klántag! Saját kerületet nem lehet támadni (azt "Erősíteni" lehet).

Költség: Bátorság (Nerve) és Energia.

Logika:

Támadás: Vonj le a defense-ből (User Sebzés alapján).

Ha defense <= 0: FOGLALÁS!

Az új tulajdonos a támadó klánja.

A defense visszaáll 50%-ra.

eventsService.broadcast: "HÍR: A [KLÁN] elfoglalta a [KERÜLET]-et!"

Erősítés (Ha a sajátod): Töltsd vissza a defense-t.

Passzív Adó (Integráció a CrimesService-be):

Ez a "Hook" a legfontosabb!

Amikor bárki bűntényt követ el, nézd meg, melyik kerülethez tartozik a bűntény (rendelj kerületet a bűntényekhez, vagy randomizáld).

Ha a kerületnek van tulajdonosa, a zsákmányolt pénz egy kis részét (pl. 5%) generáld le extraként, és írd jóvá a Klán Bankjában (ehhez kell egy bank mező a Clan entitásba).

UI - Várostérkép (src/pages/CityMap.tsx):

Vizuális Térkép: Nem kell Google Maps! Használj egy CSS Grid-et vagy egy stilizált SVG-t/képet, ahol a kerületek "Kártyák".

Kártya Nézet:

Kerület neve.

Tulajdonos Klán (Színezett kerettel).

Védelmi csík (Progress Bar).

Gomb: "TÁMADÁS" (Piros) vagy "VÉDÉS" (Zöld).

Effektek: Ha egy kerületet épp támadnak (változik a HP), villanjon fel a kerete.

Navigáció:

Új menüpont: "Térkép" (Ikon: Map vagy Globe).

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement territory wars map and clan tax system.