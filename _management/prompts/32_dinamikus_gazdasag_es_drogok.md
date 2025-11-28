Szia! A játékosok kereskednek, de az árak kőbe vannak vésve. Tegyük a gazdaságot Dinamikussá, és vezessük be a Kereskedelmi Árucikkeket (Commodities / Drugs).

A feladatod egy tőzsde-szerű rendszer kiépítése, ahol az árak a kereslet-kínálat alapján változnak.

Feladatok:

Adatbázis - Árucikkek (src/market/entities/commodity.entity.ts):

id, name (pl. "Szintetikus Benzin", "Chipek", "Stimulánsok").

basePrice (Int).

currentPrice (Int).

volatility (Float) - Mennyire ugrálhat az ára?

demand (Int) - Kereslet szintje.

Inventory Bővítés:

A meglévő Inventory táblát használd, de tegyél lehetővé "stackelést" (mennyiség tárolását), vagy hozz létre egy egyszerűsített UserCommodity táblát (userId, commodityId, amount). Javaslom az utóbbit a tisztaságért.

Market Service - Ármozgás (src/market/market.service.ts):

updatePrices(): Cron job (pl. 10 percenként).

Logika:

Minden árucikk árát módosítsd random módon a volatility alapján (+- 5%).

Kereslet hatása: Ha az elmúlt ciklusban sokat vettek, növeld az árat. Ha sokat adtak el, csökkentsd.

getCommodities(): Listázza az árakat és a változást (pl. "+2.5%").

Kereskedés (Buy/Sell):

buyCommodity(userId, commodityId, amount): Pénz levon -> Áru jóváírás.

sellCommodity(userId, commodityId, amount): Áru levon -> Pénz jóváírás (aktuális áron).

UI - Tőzsde Oldal (src/pages/Commodities.tsx):

Árfolyamtábla:

Áru neve.

Jelenlegi Ár.

Változás (Zöld nyíl felfelé, Piros lefelé).

Chart (Opcionális: egy egyszerű SVG vonaldiagram az elmúlt 5 árváltozásról).

Tranzakció:

"Vétel" / "Eladás" fülek.

Mennyiség csúszka vagy input.

"Összesen: $X" kijelzés.

Navigáció:

Új menüpont: "Tőzsde" (Ikon: TrendingUp vagy BarChart2).

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement dynamic commodity market with price fluctuation.