import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Broadcast } from './broadcast.entity';
import { Conversation } from './conversation.entity';
import { UnixTimestampColumn } from '@/common/decorators/unix-timestamp-columns.decorator';
import { RootEntity } from '@/common/models/root-entity';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { Message } from './message.entity';

@Entity('broadcast_receipts')
export class BroadcastReceipt extends RootEntity {
  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'delivered' | 'failed' | 'read';

  @Column({ default: 0 })
  attempts: number;

  @Column({ default: 3 })
  max_attempts: number;

  @Column({ nullable: true, type: 'text' })
  error_message?: string;

  @UnixTimestampColumn({ nullable: true })
  last_attempt_at?: Date;

  @UnixTimestampColumn({ nullable: true })
  delivered_at?: Date;

  @UnixTimestampColumn({ nullable: true })
  read_at?: Date;

  @ManyToOne(() => Broadcast)
  broadcast: Broadcast;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'recipient_id' })
  recipient: Profile;

  @ManyToOne(() => Conversation, { nullable: true })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'delivered_message_id' })
  delivered_message: Message;
}
