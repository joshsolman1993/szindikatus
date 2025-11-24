Szia! A beléptetés tökéletesen működik. Most lépjünk a Fázis 1.2 - Játékmechanika területére. Kezdjük el a játék "lelkét", a bűntényeket.

Feladatok:

Crime Entitás Létrehozása (src/crimes/entities/crime.entity.ts):

Mezők: id (Int, AutoIncrement), name (String), description (String), energyCost (Int), difficulty (Int), minMoney (Int), maxMoney (Int), xpReward (Int).

Készíts hozzá DTO-kat, ha szükséges, de egyelőre szerver oldali seedelés lesz a fő fókusz.

Adatbázis Seedelés (Kezdő adatok):

Hozz létre egy CrimesSeeder szolgáltatást (vagy tedd az onModuleInit-be a CrimesService-ben).

Ha a crimes tábla üres, töltsd fel legalább 5 példa bűnténnyel MAGYAR nyelven.

Példák:

"Néni szatyrának ellopása" (Költség: 2, Nehézség: 10, Pénz: $10-$50)

"Trafik rablás" (Költség: 5, Nehézség: 30, Pénz: $100-$300)

"Benzinkút kifosztása" (Költség: 10, Nehézség: 60, Pénz: $500-$1200)

Bűntény Végrehajtás Logika (src/crimes/crimes.service.ts):

Készíts egy metódust: commitCrime(userId: string, crimeId: number).

Logika:

Kérd le a User-t és a Crime-ot.

Validáció: Van elég energiája a játékosnak? Ha nincs -> BadRequestException.

Siker kalkuláció: Használd a GDD képletét vagy egy egyszerűsített verziót: (UserINT / CrimeDifficulty) * RNG.

Tranzakció kezelés (KÖTELEZŐ!): Az energia levonását és a pénz jóváírását egy adatbázis tranzakcióban (entityManager.transaction) végezd! Ha bármi hiba van, ne vonjon le energiát pénz nélkül.

Eredmény: A függvény térjen vissza egy objektummal: { success: boolean, gainedMoney: number, gainedXp: number, newEnergy: number, message: string }.

Crimes Controller (src/crimes/crimes.controller.ts):

GET /crimes: Listázza az összes elérhető bűntényt (hogy a Frontend meg tudja jeleníteni).

POST /crimes/commit/:id: A bejelentkezett felhasználó (@UseGuards(JwtAuthGuard)) elköveti a bűntényt.

Config használat:

Ne felejtsd el használni a game-balance.config.ts fájlt a konstansokhoz, ha szükséges.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: add crime system with seeding and transaction logic.