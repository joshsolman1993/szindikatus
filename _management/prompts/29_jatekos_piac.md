Szia! A rendszerünk stabil és gyors. Most nyissuk meg a kapukat a szabad kereskedelem előtt. Építsük meg a Játékos Piacot (Marketplace).

A feladatod, hogy lehetővé tedd a játékosok közötti tárgykereskedelmet.

Feladatok:

Adatbázis Entitás (src/market/entities/market-listing.entity.ts):

id (UUID)

sellerId (User FK)

inventoryId (Inventory FK - amit eladnak)

price (BigInt/String - amennyiért árulják)

createdAt (Date)

isActive (Boolean, default: true)

Market Service Bővítése (src/market/market.service.ts):

createListing(userId, inventoryId, price):

Validáció: A tárgy a useré? Nincs felszerelve? Nincs már listázva?

Lock: A listázott tárgyat "zárolni" kell (pl. isListed flag az Inventory-ban, vagy csak ellenőrizni, hogy van-e aktív listing rá).

Létrehoz egy MarketListing-et.

buyListing(buyerId, listingId):

Tranzakció (PESSIMISTIC_WRITE lockkal!):

Ellenőrizd: A listing aktív? Van elég pénze a vevőnek?

Pénzmozgás: Vevő -> Eladó (esetleg -5% piaci adó a rendszernek).

Tárgy átadása: inventory.userId = buyerId.

Listing lezárása (isActive = false).

Értesítés (Socket): Az eladónak ("Megvették a tárgyadat!").

cancelListing(userId, listingId):

Ha meggondolja magát, leveheti a tárgyat.

Frontend API (src/api/market.ts):

getListings(): Aktív ajánlatok lekérése.

createListing(id, price): Eladásra kínálás.

buyListing(id): Megvétel.

UI - Játékos Piac Oldal (src/pages/PlayerMarket.tsx):

Két fül: "Vásárlás" | "Saját Ajánlatok".

Vásárlás: Lista a mások által feltett tárgyakról (Tárgy neve, Bónuszok, Ár, Eladó neve).

Gomb: "Megvétel".

Leltár Integráció: A InventoryPage-en a tárgy kártyára kerüljön egy "Eladás" gomb, ami felhoz egy modalt, ahol beírhatod az árat.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement player-to-player marketplace with secure transactions.