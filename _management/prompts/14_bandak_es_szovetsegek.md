Szia! A város már él és beszélget. Itt az ideje, hogy a bűnözők szerveződni kezdjenek. A feladatod a Banda (Clan) Rendszer alapjainak lerakása.

Feladatok:

Adatbázis Entitások (src/clans/entities):

Clan Entity: id (UUID), name (Unique), tag (max 4 chars, pl. [BOSS]), description, leaderId (User FK), createdAt.

User Entity Bővítés: Add hozzá a clanId (nullable) és clanRank (enum: LEADER, MEMBER) mezőket a User-hez. (Vagy használhatsz külön ClanMember kapcsolótáblát is, de a User-be ágyazott FK egyszerűbb lekérdezést tesz lehetővé a listáknál).

Clans Service (src/clans/clans.service.ts):

createClan(userId, dto):

Költség: Banda alapítása kerüljön pénzbe (pl. $10,000 - configból).

Validáció: A név/tag egyedi? A user már tagja másnak?

Tranzakció: Pénz levonás -> Clan létrehozás -> User update (clanId, rank=LEADER).

joinClan(userId, clanId):

Egyszerűsített verzió: "Nyílt" bandák, bárki csatlakozhat. (Később lehet meghívásos).

Validáció: Nincs még bandában?

leaveClan(userId):

Kilépés logika. Ha a LEADER lép ki, a banda megszűnik (vagy átruházódik, de most legyen megszűnés az egyszerűség kedvéért).

getClanDetails(clanId): Listázza a tagokat.

Frontend API és Context:

Bővítsd a User típust a clan adatokkal.

API: createClan, joinClan, leaveClan, getClansList.

UI - Banda Oldal (src/pages/Clans.tsx):

Nézet A (Ha nincs bandád):

Lista a létező bandákról (Név, Tag, Létszám).

Gomb: "Csatlakozás".

Panel: "Banda Alapítása" (Űrlap: Név, Tag + "Alapítás $10,000" gomb).

Nézet B (Ha van bandád):

Banda neve és leírása.

Taglista (Avatar, Név, Rang).

Gomb: "Kilépés".

Vizuális Integráció (Mindenhol):

A PlayerCard (Utca), a Chat és a Profile komponensekben jelenjen meg a banda tag a név mellett.

Formátum: [TAG] Username (pl. narancssárga színnel).

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement clan system (create, join, list).