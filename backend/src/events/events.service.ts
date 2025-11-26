import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {
    constructor(private eventsGateway: EventsGateway) { }

    emitToAll(event: string, data: any) {
        if (this.eventsGateway.server) {
            this.eventsGateway.server.emit(event, data);
        }
    }
}
