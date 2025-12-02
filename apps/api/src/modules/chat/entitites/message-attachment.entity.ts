import { AuditableEntity } from '@/common/models/auditable-entity';
import { Message } from './message.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('message_attachments')
export class MessageAttachment extends AuditableEntity {
  // @ManyToOne(() => Asset)
  // @JoinColumn({ name: 'asset_id' })
  // asset: Asset;

  @ManyToOne(() => Message, (message) => message.attachments)
  @JoinColumn({ name: 'message_id' })
  message: Message;
}
