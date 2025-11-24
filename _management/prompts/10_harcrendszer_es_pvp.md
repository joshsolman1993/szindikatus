Szia! A színpad készen áll, a szereplők a helyükön. Itt az ideje a PvP Harcrendszer (Combat System) megépítésének!

A feladatod a szerver oldali harci logika és a kliens oldali visszajelzés implementálása.

Feladatok:

Fight Service (src/fight/fight.service.ts):

Hozz létre egy új modult: FightModule.

Validáció (canAttack):

Támadónak van elég Bátorsága (Nerve)? (Pl. 2 pont).

Áldozat nem "védett" (pl. nem admin, vagy nincs Kórházban/HP > 0)?

Támadó HP > 10? (Sérülten nem lehet támadni).

Szimuláció (calculateOutcome):

Készíts egy egyszerű képletet:

AttackerScore = (STR + SPD) * (random 0.8 - 1.2)

DefenderScore = (DEF + DEX) * (random 0.8 - 1.2)

Ha AttackerScore > DefenderScore -> Győzelem.

Végrehajtás (executeFight - Tranzakcióban!):

Vonj le Bátorságot a támadótól.

Győzelem esetén:

Rablás: Az áldozat készpénzének (cash) 10%-a átkerül a támadóhoz.

XP: Támadó kap X tapasztalatot.

HP: Áldozat veszít (pl. 30) HP-t, Támadó veszít keveset (pl. 5).

Vereség esetén:

Támadó veszít sok (pl. 20) HP-t.

Áldozat kap XP-t a védekezésért.

Kórházba küldés: Ha valaki HP-ja 0 alá csökken, állítsd 0-ra. (Később itt lesz a status effect, most elég a 0 HP).

Fight Controller (src/fight/fight.controller.ts):

POST /fight/attack/:targetId

Visszatérési érték (JSON): { winner: boolean, moneyStolen: number, xpGained: number, damageDealt: number, damageTaken: number, logs: string[] } (pl. "Te bevittél egy jobb horgot...").

Frontend Integráció (src/pages/TheStreets.tsx):

Kösd be a "Támadás" gombot a PlayerCard-on.

Visszajelzés (Modal/Alert):

Ne csak egy Toast legyen! Ha vége a harcnak, jelenjen meg egy ablak (Modal), ami részletesen kiírja az eredményt.

"GYŐZELEM! Elloptál $450-t és szereztél 20 XP-t." (Zöld) vagy "VERESÉG! Kaptál egy nagy pofont (-20 HP)." (Piros).

Frissítsd a User Context-et (mert változott a pénz/HP/Nerve).

Config:

A Bátorság költséget (pl. 2) tedd a game-balance.config-ba.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement pvp combat system logic and result modal.