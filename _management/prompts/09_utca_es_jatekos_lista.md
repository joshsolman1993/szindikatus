Szia! Gratulálok, a Fázis 1 sikeresen lezárult. Most elkezdjük a Fázis 2-t: Interakció és Harc.

Az első lépés, hogy a játékosok lássák egymást. Építsük meg az "Utca" (The Streets) modult.

Feladatok:

Backend - Biztonságos User Lista (src/users/users.controller.ts):

Készíts egy GET /users végpontot.

Kritikus Biztonság: SOHA ne küldd le a jelszót, emailt vagy a pontos pénzösszeget!

Használd a ClassSerializerInterceptor-t és az @Exclude() dekorátort a User entitásban, VAGY készíts egy PublicUserDto-t (id, username, level/rank, avatarUrl).

Logika: Listázd ki a játékosokat, KIVÉVE a saját magát (aki épp be van lépve).

Opcionális: Ha sok user van, limitáld a lekérdezést (pl. utolsó 50 aktív játékos).

Avatar Generálás (Backend):

A User entitásban (vagy a DTO-ban) hozz létre egy "virtuális" mezőt avatarUrl néven.

Használd a DiceBear API-t a generáláshoz a username alapján.

URL minta: https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=b6e3f4 (vagy válassz egy "darkosabb" stílust).

Frontend API (src/api/users.ts):

getPlayers(): GET /users hívás.

UI Oldal - Az Utca (src/pages/TheStreets.tsx):

Készíts egy oldalt, ahol "Rács" (Grid) elrendezésben jelennek meg a játékos kártyák.

PlayerCard Komponens:

Avatar kép.

Felhasználónév.

Becsült erő (pl. az összes stat összege).

"Támadás" Gomb: Egyelőre legyen inaktív (disabled) vagy csak írja ki konzolra: "Támadás indítása...". (A harcrendszert a következő promptban írjuk meg).

Keresőmező: Az oldal tetejére tegyél egy egyszerű input mezőt, amivel lehet szűrni a nevek között (kliens oldali szűrés elég most).

Navigáció:

Add hozzá az "Utca" menüpontot a Sidebarhoz. Ikonnak használd a Map vagy Users ikont a lucide-react-ból.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt (Fázis 2 elkezdve).

Git commit: feat: implement player list (The Streets) with secure dto.