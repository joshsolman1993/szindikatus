Szia! A játékosok kezdik unni a monoton farmolást. Dobjuk fel a hangulatot egy kis szerencsejátékkal!

A feladatod a Kaszinó Modul implementálása.

Feladatok:

Backend - Casino Service (src/casino/casino.service.ts):

Pénzfeldobás (Coinflip):

Input: Tét összege.

Logika: 50-50 esély.

Ha nyer: Tét * 2 jóváírása.

Ha veszít: Tét levonása.

Nyerőgép (Slots):

Input: Tét összege.

Logika: Generálj 3 szimbólumot (pl. 🍒, 🍋, 🔔, 💎, 7️⃣).

Nyereménytábla:

3 db 🍒 = Tét * 5

3 db 7️⃣ = Tét * 50 (Jackpot)

2 db egyforma = Tét visszajár (vagy kicsi nyeremény).

API Végpontok (src/casino/casino.controller.ts):

POST /casino/coinflip: Body: { amount: number, choice: 'head' | 'tail' }

POST /casino/spin: Body: { amount: number }

Validáció: Usernek legyen elég pénze a téthez.

UI - Kaszinó Oldal (src/pages/Casino.tsx):

Hangulat: Neonfények, sötétzöld posztó asztal, "Las Vegas" stílus (Cyberpunk verzióban).

Játék 1: Pénzfeldobás:

Egy egyszerű érme animáció (CSS rotate).

Gombok: "Fej", "Írás" és Tét beviteli mező.

Játék 2: Nyerőgép (Slots):

3 db "tárcsa" (div), amikben pörögnek az emojik.

"Pörgetés" gomb.

SFX: Használd a useGameSound-ot! Nyerésnél csörögjön a pénz (playCash), pörgetésnél legyen hangeffekt.

Navigáció:

Új menüpont: "Kaszinó" (Ikon: Dices vagy DollarSign).

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement casino minigames (coinflip, slots).