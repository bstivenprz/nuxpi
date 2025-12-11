import { IEvent } from '@nestjs/cqrs';

export class ProcessBroadcastEvent implements IEvent {
  constructor(readonly broadcast_id: string) {}
}
