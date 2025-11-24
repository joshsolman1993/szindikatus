import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UseGuards, Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger = new Logger('ChatGateway');

    constructor(private jwtService: JwtService) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token;
            if (!token) {
                this.logger.warn(`Client ${client.id} tried to connect without token`);
                client.disconnect();
                return;
            }

            // Verify token
            // Note: We assume the secret is available via JwtModule configuration
            const payload = await this.jwtService.verifyAsync(token);

            // Store user info in socket
            client.data.user = payload;

            this.logger.log(`Client connected: ${client.id} (User: ${payload.username})`);
        } catch (error) {
            this.logger.error(`Connection error for client ${client.id}: ${error.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { message: string }
    ): void {
        const user = client.data.user;
        if (!user) return;

        const messageData = {
            id: Date.now().toString(),
            sender: user.username,
            message: payload.message,
            timestamp: new Date(),
            type: 'chat'
        };

        this.server.emit('messageToClient', messageData);
    }

    // System broadcast method
    broadcastSystemEvent(message: string, type: 'combat' | 'crime' | 'info' = 'info') {
        const eventData = {
            id: Date.now().toString(),
            message,
            type,
            timestamp: new Date(),
        };
        this.server.emit('systemNotification', eventData);
    }
}
