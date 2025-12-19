import { RootEntity } from '@/common/models/root-entity';
import { Entity, JoinColumn, OneToOne, Unique } from 'typeorm';
import { Publication } from './publication.entity';
import { Profile } from '@/modules/profile/entities/profile.entity';

@Entity('pinned_publications')
@Unique(['profile'])
export class PinnedPublication extends RootEntity {
  @OneToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @OneToOne(() => Publication, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'publication_id' })
  publication: Publication;

  constructor(props?: Partial<PinnedPublication>) {
    super();
    Object.assign(this, props);
  }
}
