import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('ChatGateway');

    constructor(private jwtService: JwtService) { }

    handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token;
            // Egyszerű token ellenőrzés (a valóságban validálni kellene)
            if (!token) {
                // client.disconnect(); // Fejlesztés alatt engedékenyebb
                this.logger.log(`Client connected without token: ${client.id}`);
            } else {
                this.logger.log(`Client connected: ${client.id}`);
            }
        } catch (e) {
            this.logger.error(e);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: { message: string }): void {
        // Broadcast mindenkinek
        this.server.emit('messageToClient', {
            id: Math.random().toString(36).substr(2, 9),
            sender: 'User', // Itt ki kellene szedni a user nevet a tokenből
            message: payload.message,
            timestamp: new Date(),
            type: 'chat',
        });
    }
}
