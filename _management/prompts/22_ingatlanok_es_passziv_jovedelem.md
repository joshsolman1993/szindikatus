Szia! A Kaszinó pörög, de a játékosoknak stabil befektetésekre is szükségük van. Építsük ki az Ingatlan (Real Estate) rendszert, ami passzív jövedelmet biztosít.

A feladatod az ingatlanvásárlás és a jövedelembegyűjtés (Income Collection) implementálása.

Feladatok:

Adatbázis Entitások (src/properties):

Property Entity: id, name, cost (Int), incomePerHour (Int), description, imageUrl.

UserProperty Entity: Kapcsolótábla. userId, propertyId, level (Int - később fejleszthető), lastCollectedAt (Date - mikor szedte be utoljára a pénzt).

Seedelés (Kezdő Ingatlanok):

Hozz létre legalább 4 típust:

"Putri a 8. kerületben" (Ár: $2,000, Bevétel: $50/óra)

"Illegális Szeszfőzde" (Ár: $15,000, Bevétel: $500/óra)

"Éjszakai Klub" (Ár: $150,000, Bevétel: $4,000/óra)

"Fegyvergyár" (Ár: $2,000,000, Bevétel: $50,000/óra)

Properties Service (src/properties/properties.service.ts):

buyProperty(userId, propertyId):

Validáció: Van elég pénze? Nincs még meg neki ez az ingatlan? (Most legyen limit: típusonként max 1).

Tranzakció: Pénz levonás -> UserProperty létrehozása (lastCollectedAt = MOST).

collectIncome(userId):

Kérd le a user összes ingatlanát.

Számítás: Minden ingatlannál: (Most - lastCollectedAt) órában * incomePerHour.

Összegezd a bevételeket.

Cap (Limit): Maximálisan 24 órányi bevételt lehessen felhalmozni (hogy be kelljen lépni naponta).

Tranzakció: Jóváírás a Usernek -> lastCollectedAt frissítése MOST-ra mindenhol.

Válasz: { collectedAmount: number }.

UI - Ingatlanok Oldal (src/pages/Properties.tsx):

Layout: Két fül vagy szekció.

Piac: Elérhető ingatlanok kártyái (Kép, Ár, Bevétel/óra). "Vásárlás" gomb.

Saját Birodalom: Megvett ingatlanok listája.

Begyűjtés Panel:

Az oldal tetején egy nagy "Összes Bevétel Begyűjtése" gomb.

Írja ki dinamikusan, mennyi gyűlt össze eddig (kliens oldali számláló, ami a lastCollectedAt alapján pörög).

Begyűjtéskor: playCash() hang + Toast üzenet.

Navigáció:

Új menüpont: "Ingatlanok" (Ikon: Building vagy Briefcase).

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement real estate system with passive income collection.