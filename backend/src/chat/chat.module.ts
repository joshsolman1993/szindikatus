import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        AuthModule,
    ],
    controllers: [ChatController],
    providers: [ChatGateway, ChatService],
    exports: [ChatService, ChatGateway],
})
export class ChatModule { }
