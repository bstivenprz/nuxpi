import { AuditableEntity } from '@/common/models/auditable-entity';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('conversations')
export class Conversation extends AuditableEntity {
  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'created_by' })
  created_by: Profile;
}
