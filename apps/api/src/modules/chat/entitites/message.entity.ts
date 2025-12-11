import { AuditableEntity } from '@/common/models/auditable-entity';
import { MessageAttachment } from './message-attachment.entity';
import { Conversation } from './conversation.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { AutoMap } from '@automapper/classes';

@Entity('messages')
export class Message extends AuditableEntity {
  @Column({ default: 'text' })
  type: 'text' | 'image' | 'video' | 'ppv';

  @Column({ nullable: true })
  content?: string;

  @Column({ default: false })
  is_broadcast: boolean;

  @AutoMap(() => Profile)
  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'sender_id' })
  sender: Profile;

  /** autoMapIgnore */
  @ManyToOne(() => Conversation, { nullable: true })
  @JoinColumn({ name: 'conversation_id' })
  conversation?: Conversation;

  /** autoMapIgnore */
  @OneToMany(() => MessageAttachment, (attachment) => attachment.message, {
    onDelete: 'CASCADE',
  })
  attachments?: MessageAttachment[];
}
