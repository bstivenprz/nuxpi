import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Broadcast } from './broadcast.entity';
import { Conversation } from './conversation.entity';
import { UnixTimestampColumn } from '@/common/decorators/unix-timestamp-columns.decorator';
import { RootEntity } from '@/common/models/root-entity';
import { Profile } from '@/modules/profile/entities/profile.entity';

@Entity('broadcast_receipts')
export class BroadcastReceipt extends RootEntity {
  @Column({ default: 'pending' })
  status: 'pending' | 'delivered' | 'failed' | 'read';

  @Column({ default: 0 })
  attempts: number;

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

  @ManyToOne(() => Conversation)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;
}
