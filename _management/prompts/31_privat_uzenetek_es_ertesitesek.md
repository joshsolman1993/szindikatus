Szia! A piac dübörög, a loot esik. De a játékosok még mindig csak a globális chaten tudnak ordítozni egymással. Építsük ki a Privát Üzenetküldést (DM) és a Kereskedelmi Értesítéseket.

A feladatod, hogy a játékosok diszkréten tudjanak kommunikálni és alkudozni.

Feladatok:

Adatbázis - Üzenetek (src/chat/entities/message.entity.ts):

Hozz létre egy perzisztens (adatbázisba mentett) üzenet entitást.

id, senderId, receiverId, content, createdAt, isRead.

Megjegyzés: A Socket.io eddig csak "tűz és felejts" (fire-and-forget) módon küldött. Most tárolni is kell.

Chat Service & Gateway Bővítése (src/chat):

sendPrivateMessage(senderId, receiverId, content):

Mentsd el az üzenetet az adatbázisba.

Küldd el Socketen a címzettnek (privateMessage event).

Ha a címzett offline, akkor is megkapja, amikor belép (mert le tudja kérni az olvasatlanokat).

getConversation(userId, partnerId): Lekéri a korábbi üzenetváltást.

markAsRead(userId, senderId): Olvasottnak jelölés.

Frontend - Chat Widget Fejlesztése (src/components/layout/ChatWidget.tsx):

Új Fül: "Privát".

Partner Lista: Bal oldalon lista azokról, akikkel beszélgettél (Avatar + Név + Olvasatlan számláló).

Chat Ablak: Jobb oldalon a konkrét beszélgetés buborékokkal.

Indítás:

A PlayerCard (Utca/Ranglista) komponensen a "Támadás" mellett legyen egy "Üzenet" gomb is.

A MarketPage-en az eladó neve mellett is legyen "Üzenet" (Alkudozáshoz).

Kereskedelmi Értesítések (Market Service Integráció):

Amikor valaki megveszi a tárgyadat a piacon (buyItem):

Küldj egy automatikus Rendszerüzenetet (DM-et) az eladónak:

"Rendszer: [VevőNeve] megvette a(z) [TárgyNeve] tárgyadat $X-ért."

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: feat: implement persistent private messaging and market notifications.