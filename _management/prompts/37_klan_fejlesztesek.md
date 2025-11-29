Szia! A rendszer stabil, most adjunk értelmet a Klánoknak. Jelenleg a területfoglalásból származó adó csak gyűlik a clan.bank-ban, de "halott tőke".

A feladatod a Klán Fejlesztések (Clan Upgrades) rendszerének kiépítése.

Feladatok:

Adatbázis - Upgrade Entitás (src/clans/entities/clan-upgrade.entity.ts):

id, clanId (FK).

type (Enum: FORTRESS, TRAINING_GROUND, BLACK_MARKET_CONN).

level (Int, default: 0).

Definíciók (Config vagy Constant):

ERŐD (Fortress): Minden kerület védelmét növeli +10%-kal szintenként.

Ár: $50,000 * level.

KIKÉPZŐKÖZPONT (Training Ground): Minden klántag +2% XP-t kap harcokból szintenként.

Ár: $100,000 * level.

ALVILÁGI KAPCSOLATOK (Black Market Conn): -2% adó (vagy +bevétel) a piacozásból.

Ár: $75,000 * level.

Clans Service Bővítése:

buyUpgrade(leaderId, upgradeType):

Validáció: Csak a Leader veheti meg! Van elég pénz a clan.bank-ban?

Tranzakció: Pénz levonás a bankból -> Upgrade szint növelése.

getClanUpgrades(clanId): Listázza a jelenlegi szinteket.

Bónuszok Alkalmazása (Integráció):

Territory Service: Amikor a maxDefense-t számolod, szorozd fel a FORTRESS szintjével.

Fight Service: XP osztásnál nézd meg, van-e TRAINING_GROUND a user klánjának.

UI - Klán Kincstár (src/pages/Clans.tsx vagy új aloldal):

Bank Panel:

Mutassa a clan.bank egyenlegét (nagy zöld szám).

(Opcionális: "Adományozás" gomb, ha a tagok be akarnak fizetni).

Fejlesztések Lista:

Kártyák a fejlesztésekről (Ikon, Név, Leírás).

Jelenlegi szint.

"Fejlesztés ($X)" gomb (csak a Leadernek aktív).

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement clan upgrades and bank spending mechanics.