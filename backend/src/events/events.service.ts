import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {
  constructor(private eventsGateway: EventsGateway) {}

  emitToAll(event: string, data: any) {
    if (this.eventsGateway.server) {
      this.eventsGateway.server.emit(event, data);
    }
  }

  broadcastToUser(userId: string, event: string, data: any) {
    if (this.eventsGateway.server) {
      // Emitting to a room named after the userId
      this.eventsGateway.server.to(userId).emit(event, data);
    }
  }

  broadcastSystemEvent(message: string, type: string) {
    if (this.eventsGateway.server) {
      this.eventsGateway.server.emit('system-event', { message, type });
    }
  }
}
