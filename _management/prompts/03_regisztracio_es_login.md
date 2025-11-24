Szia! A Changelog alapján remekül haladunk. Most következik a Fázis 1.1 legfontosabb része: a felhasználók beengedése.

A feladatod a Regisztráció és Login (Auth) rendszer teljes körű implementálása.

Lépések:

Függőségek Telepítése:

Szükséged lesz: @nestjs/jwt, @nestjs/passport, passport, passport-jwt, bcrypt (a jelszó hasheléshez), és class-validator + class-transformer (a bemeneti adatok ellenőrzéséhez).

Megjegyzés: Ha nincs terminál hozzáférésed, írd le a parancsot, és én futtatom, de a kódot készítsd elő úgy, mintha már telepítve lennének.

Users Service Bővítése (src/users/users.service.ts):

Implementáld a create metódust.

FONTOS: A jelszót soha ne mentsd sima szövegként! Használd a bcrypt.hash()-t mentés előtt.

Implementáld a findByEmail metódust (a loginhoz kell majd).

Auth Module Létrehozása (src/auth):

DTO-k: Hozz létre RegisterDto (email, username, password) és LoginDto osztályokat. Használd a class-validator dekorátorokat (pl. @IsEmail(), @MinLength(6)). Ez kötelező a GDD biztonsági előírásai miatt!

AuthService:

validateUser: Ellenőrzi az emailt és összehasonlítja a jelszót (bcrypt.compare).

login: Ha a validálás sikeres, generál egy JWT (JSON Web Token) tokent, ami tartalmazza a sub (userId) és username adatokat.

JwtStrategy: Hozz létre egy stratégiát, ami védi majd a későbbi végpontokat (hogy csak bejelentkezett user érhesse el őket).

Auth Controller (src/auth/auth.controller.ts):

POST /auth/register: Új felhasználó létrehozása.

POST /auth/login: Bejelentkezés -> Visszatérési érték: { access_token: "..." }.

Hibakezelés:

Ha valaki olyan emaillel regisztrál, ami már létezik, dobj egyértelmű ConflictException-t ("Ez az email cím már foglalt.").

Használd a try-catch blokkokat az adatbázis műveleteknél.

Tesztelési Cél:
A feladat végén képesnek kell lennem Postman/Curl segítségével regisztrálni egy új felhasználót, majd a kapott adatokkal bejelentkezni és visszakapni egy JWT tokent.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt (Fázis 1.1 státuszok).

Kövesd a Git protokollt (commit üzenet: feat: implement auth system with jwt and bcrypt).