import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    sendNotificationToUser(userId: string, data: any) {
        this.server.to(`user:${userId}`).emit('notification', data);
    }
}
