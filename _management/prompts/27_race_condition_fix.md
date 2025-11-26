Szia! A felhasználói felület most már stabil. Ideje megerősíteni a backendet a csalók és a véletlen hibák ellen.

A feladatod a Versenyhelyzetek (Race Conditions) kiküszöbölése az adatbázis tranzakciókban a PESSIMISTIC_WRITE lock használatával.

Probléma: Jelenleg, ha két kérés egyszerre érkezik (pl. dupla kattintás vásárláskor), a rendszer kétszer is levonhatja az összeget azelőtt, hogy az első tranzakció frissítené az egyenleget.

Feladatok (Minden kritikus service-ben):

MarketService (src/market/market.service.ts):

A buyItem metódusban, a tranzakción belül, amikor lekéred a User-t:

Használd a lock: { mode: 'pessimistic_write' } opciót.

Kód: manager.findOne(User, { where: { id: userId }, lock: { mode: 'pessimistic_write' } }).

CrimesService (src/crimes/crimes.service.ts):

A commitCrime metódusban a User lekérésénél alkalmazd ugyanezt a lockot.

Ez megakadályozza, hogy valaki több bűntényt kövessen el, mint amennyi energiája van.

FightService (src/fight/fight.service.ts):

Az executeFight metódusban a Támadó (attacker) és a Védő (defender) lekérésénél is alkalmazd a lockot.

Fontos: Figyelj a Deadlock (holtpont) elkerülésére! Mindig rendezett sorrendben kérd le a lockokat (pl. ID szerint növekvő sorrendben), vagy egyszerűen lockold a támadót, aztán a védőt (bár ID sorrend a legbiztosabb).

Egyszerűsítés: Elég, ha a Támadót lockolod a Bátorság/HP miatt. A Védő pénzének levonása kevésbé kritikus race condition szempontból, de a biztonság kedvéért lockolhatod mindkettőt.

UsersService (src/users/users.service.ts):

A train (edzés) metódusban is lockold a usert, hogy ne tudjon negatív energiába menni gyors kattintással.

PropertiesService (src/properties/properties.service.ts):

A buyProperty és collectIncome metódusoknál is.

Tesztelés (Gondolatban):

Képzeld el, hogy 10 kérés érkezik be 1 milliszekundum alatt. A Lock miatt a 2. kérésnek meg kell várnia, amíg az 1. végez (commitol), így a 2. kérés már a frissített (csökkentett) egyenleget fogja látni.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: fix: prevent race conditions using pessimistic locking in transactions.