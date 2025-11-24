import { Injectable } from '@nestjs/common';
import { ChatGateway } from '../../chat/chat.gateway';

@Injectable()
export class EventsService {
    constructor(private chatGateway: ChatGateway) { }

    broadcastSystemEvent(message: string, type: 'combat' | 'crime' | 'info') {
        this.chatGateway.broadcastSystemEvent(message, type);
    }
}
