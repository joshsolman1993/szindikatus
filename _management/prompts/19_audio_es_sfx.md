Szia! A Dashboard vizuális átalakítása sikeres volt, most már igazi Cyberpunk HUD hangulata van. Gratulálok!

Most lépjünk a "Polírozás" fázisba. A játék jelenleg néma. Adjunk hozzá Hangeffekteket (SFX), hogy a kattintásoknak súlya legyen.

Feladatok:

Függőség Telepítése:

Telepítsd a use-sound csomagot a frontendbe (ez a legkönnyebb React hook hangokhoz).

Hangok Beszerzése (Placeholders):

Hozz létre egy src/assets/sounds mappát.

Mivel nem tudsz fájlokat generálni, használd a Howler.js vagy use-sound sprite funkcióját, VAGY használj publikus URL-eket teszteléshez (pl. Freesound preview linkek).

Szükséges effektek:

click.mp3: Rövid, digitális csippanás (gombokhoz).

cash.mp3: Pénz csörgés (sikeres bűntény/eladás).

punch.mp3: Ütés hang (harc).

error.mp3: Mély "Buzz" hang (ha nincs energia/hiba van).

level_up.mp3: Valami epikusabb hang.

Sound Hook (src/hooks/useGameSound.ts):

Készíts egy hook-ot, ami exportálja a lejátszható hangokat.

const { playClick, playCash, playError } = useGameSound();

Beállítás: Figyelje a localStorage-t (pl. settings_mute), hogy a játékos le tudja-e némítani a játékot.

Integráció a Komponensekbe:

Gombok: Minden .btn-primary gombra tegyél onClick={() => { playClick(); ... }}-et.

Bűntények (Crimes.tsx):

Siker esetén: playCash()

Hiba esetén: playError()

Harc (TheStreets.tsx):

Támadáskor: playPunch()

Avatar Stílus Frissítése (Apró javítás):

A User entitásban (vagy ahol a DiceBear URL generálódik) cseréld le a stílust.

Régi: avataaars

Új javaslat: bottts (robotok) vagy lorelei (komolyabb portrék).

Példa URL: https://api.dicebear.com/7.x/bottts/svg?seed=${username}&backgroundColor=1f2937 (Sötét háttérrel).

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement sound effects (sfx) using use-sound hook.