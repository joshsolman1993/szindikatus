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
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        this.logger.log(`Client connected without token: ${client.id}`);
        // client.disconnect();
        return;
      }

      const payload = this.jwtService.decode(token);
      if (payload && payload.sub) {
        client.data.userId = payload.sub;
        client.join(`user_${payload.sub}`);
        this.logger.log(`Client authenticated: ${client.id} as ${payload.sub}`);
      } else {
        this.logger.log(`Invalid token for client: ${client.id}`);
        // client.disconnect();
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
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { message: string },
  ): void {
    this.server.emit('messageToClient', {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'User',
      message: payload.message,
      timestamp: new Date(),
      type: 'chat',
    });
  }

  @SubscribeMessage('sendPrivateMessage')
  async handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receiverId: string; content: string },
  ) {
    const senderId = client.data.userId;
    if (!senderId) {
      this.logger.warn(
        `Unauthenticated user tried to send message: ${client.id}`,
      );
      return;
    }

    const message = await this.chatService.saveMessage(
      senderId,
      payload.receiverId,
      payload.content,
    );

    // Emit to receiver
    this.server
      .to(`user_${payload.receiverId}`)
      .emit('privateMessage', message);

    // Emit back to sender (confirmation)
    client.emit('privateMessageSent', message);
  }
}
