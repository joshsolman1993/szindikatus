Szia! A backendünk stabil és önjáró. Most érkeztünk el a mérföldkőhöz: a Frontend (Kliens) felépítéséhez.

A feladatod a Frontend projekt inicializálása és a Hitelesítés (Auth) bekötése.

Feladatok:

React Projekt Inicializálás (Vite):

A gyökérkönyvtárban lévő frontend mappába hozz létre egy új React projektet Vite segítségével (TypeScript legyen a nyelv, hogy passzoljon a backendhez).

Telepítsd a függőségeket: axios (API hívásokhoz), react-router-dom (navigációhoz), clsx, tailwind-merge (stílushoz), lucide-react (ikonokhoz).

Inicializáld a Tailwind CSS-t a projektben (configuráld, hogy lássa a .tsx fájlokat).

API Réteg Kialakítása (src/api/client.ts):

Hozz létre egy centralizált Axios példányt (apiClient).

Interceptorok:

Request: Minden kéréshez automatikusan csatolja a Authorization: Bearer {token} fejlécet, ha van token a LocalStorage-ban.

Response: Ha a szerver 401 Unauthorized hibát dob, automatikusan léptesse ki a felhasználót (törölje a tokent és irányítsa a login oldalra).

Auth Context (src/context/AuthContext.tsx):

Készíts egy React Context-et, ami kezeli a bejelentkezett felhasználó állapotát (user, token, login, register, logout).

A login és register függvények hívják meg a megfelelő Backend végpontokat (/auth/login, /auth/register).

Oldalak és Routing:

Landing Page: Másold át a korábbi prototípus Landing Page kódját komponensekre bontva (Hero, Features, Navbar).

Auth Oldalak: Készíts egyszerű, stílusos LoginPage és RegisterPage űrlapokat (felhasználva a Landing Page stílusvilágát).

Routing (App.tsx):

Publikus útvonalak: /, /login, /register.

Védett útvonalak (Protected Route): /dashboard (egyelőre csak egy üres placeholder oldal, ami kiírja: "Üdv a belső körben").

Védelem: Ha nem bejelentkezett felhasználó próbál a /dashboard-ra menni, irányítsd át a /login-ra.

Környezeti Változók:

Hozz létre egy .env fájlt a frontendben: VITE_API_URL=http://localhost:3000 (vagy a backend portja).

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt (Fázis 1.3 elkezdve).

Git commit: feat: initialize frontend app with auth context and routing.