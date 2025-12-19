import { UnixTimestampColumn } from '@/common/decorators/unix-timestamp-columns.decorator';
import { RootEntity } from '@/common/models/root-entity';
import { Publication } from '@/modules/content/entities/publication.entity';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { AutoMap } from '@automapper/classes';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('notifications')
export class Notification extends RootEntity {
  @Column({ type: 'text', nullable: true })
  activity?: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  href?: string;

  /** @autoMapIgnore */
  @ManyToOne(() => Publication, { nullable: true })
  @JoinColumn({ name: 'publication_id' })
  publication?: Publication;

  @Column({ type: 'boolean', default: false })
  is_featured?: boolean;

  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  @UnixTimestampColumn({ nullable: true })
  notified_at?: number;

  @AutoMap(() => Profile)
  @ManyToOne(() => Profile, { eager: true })
  @JoinColumn({ name: 'target_profile_id' })
  target_profile: Profile;

  @AutoMap(() => Profile)
  @ManyToOne(() => Profile, { eager: true })
  @JoinColumn({ name: 'initiator_profile_id' })
  initiator_profile: Profile;

  set_featured(state: boolean) {
    this.is_featured = state;
  }

  set_readed(state: boolean) {
    this.is_read = state;
  }
}
