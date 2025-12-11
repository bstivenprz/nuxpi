import { AuditableEntity } from '@/common/models/auditable-entity';
import { Message } from './message.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UnixTimestampColumn } from '@/common/decorators/unix-timestamp-columns.decorator';
import { Profile } from '@/modules/profile/entities/profile.entity';

@Entity('broadcasts')
export class Broadcast extends AuditableEntity {
  @Column({ default: 'pending' })
  status: 'pending' | 'sent' | 'failed' | 'cancelled';

  @Column({ nullable: true })
  total_recipients?: number;

  @Column({ default: 0 })
  successful_deliveries: number;

  @Column({ default: 0 })
  failed_deliveries: number;

  @Column({ nullable: true, type: 'text' })
  error_message?: string;

  @UnixTimestampColumn()
  started_at: Date;

  @UnixTimestampColumn({ nullable: true })
  completed_at?: Date;

  @ManyToOne(() => Message, { onDelete: 'CASCADE' })
  message: Message;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'broadcasted_by' })
  broadcasted_by: Profile;
}
