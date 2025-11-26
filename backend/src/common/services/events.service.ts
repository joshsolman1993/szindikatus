import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
    broadcastToUser(userId: string, event: string, data: any) {
        console.log(`[EventsService] Broadcast to ${userId}: ${event}`, data);
        // TODO: Implement actual socket emission
    }

    broadcastSystemEvent(message: string, type: string) {
        console.log(`[EventsService] System Broadcast: ${message} (${type})`);
        // TODO: Implement actual socket emission
    }
}
