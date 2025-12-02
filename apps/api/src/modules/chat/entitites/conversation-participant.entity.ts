import { AuditableEntity } from '@/common/models/auditable-entity';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UnixTimestampColumn } from '@/common/decorators/unix-timestamp-columns.decorator';
import { Profile } from '@/modules/profile/entities/profile.entity';

@Entity('conversation_participants')
export class ConversationParticipant extends AuditableEntity {
  @Column({ default: 0 })
  unread_messages_count?: number;

  @UnixTimestampColumn()
  joined_at: Date;

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'last_message_id' })
  last_message: Message;

  @ManyToOne(() => Conversation, { nullable: false })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'participant_id' })
  participant: Profile;
}
