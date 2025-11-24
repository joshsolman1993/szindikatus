Szia! A harcrendszer és a piac tökéletes. Most tegyük élővé a várost! Kezdjük el a Fázis 3-at: Közösség.

A feladatod a Valós Idejű Chat és a Rendszerüzenetek (Live Feed) implementálása WebSocket segítségével.

Feladatok:

Backend - WebSocket Gateway (src/chat/chat.gateway.ts):

Telepítsd a @nestjs/platform-socket.io és @nestjs/websockets csomagokat.

Hozz létre egy ChatGateway-t.

Auth (Kritikus): A socket kapcsolatnak is hitelesítettnek kell lennie!

A JWT tokent a handshake során küldje a kliens (auth: { token: '...' }).

Ellenőrizd a tokent csatlakozáskor (handleConnection). Ha érvénytelen, bontsd a kapcsolatot.

Események:

sendMessage: A kliens küld üzenetet -> Szerver továbbítja mindenkinek (broadcast).

joinRoom: (Későbbi klánokhoz előkészület, most opciós).

Backend - Esemény Szolgáltatás (src/common/services/events.service.ts):

Ez egy olyan service, amit a FightService vagy CrimesService meghívhat, ha történik valami.

Metódus: broadcastSystemEvent(message: string, type: 'combat' | 'crime' | 'info').

Ez küldjön egy socket üzenetet a klienseknek, hogy megjelenjen a "Hírek" falon.

Integráció: A FightService-ben (harc végén) hívd meg ezt, ha nagy rablás történt (pl. > $1000 zsákmány), így mindenki látni fogja: "HÍR: X brutálisan helybenhagyta Y-t és elvett tőle $1500-t!"

Frontend - Socket Hook (src/hooks/useSocket.ts):

Hozz létre egy hook-ot, ami kezeli a socket.io-client kapcsolatot.

Csatlakozás csak bejelentkezés után (AuthContext).

Figyelje a messageToClient és systemNotification eseményeket.

UI - Chatbox és Hírek (src/components/layout/ChatWidget.tsx):

Készíts egy komponenst a képernyő jobb alsó sarkába (fix pozíció).

Két fül (Tab):

Global Chat: A játékosok beszélgetése.

Live Feed: A rendszerüzenetek (harcok, szintlépések).

Legyen "összecsukható" (Minify), hogy ne zavarjon mobilnézeten.

Az új üzeneteket emelje ki (pl. piros pötty), ha épp csukva van az ablak.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt (Fázis 3 elkezdve).

Git commit: feat: implement real-time chat and system feed with websockets.