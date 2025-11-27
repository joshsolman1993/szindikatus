import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get('conversations')
    async getConversations(@Request() req) {
        return this.chatService.getConversationsList(req.user.userId);
    }

    @Get('conversation/:partnerId')
    async getConversation(@Request() req, @Param('partnerId') partnerId: string) {
        return this.chatService.getConversation(req.user.userId, partnerId);
    }

    @Post('read/:senderId')
    async markAsRead(@Request() req, @Param('senderId') senderId: string) {
        return this.chatService.markAsRead(req.user.userId, senderId);
    }
}
