import { Profile } from '@/modules/profile/entities/profile.entity';
import { Publication } from './publication.entity';
import { RootEntity } from '@/common/models/root-entity';
import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('likes')
@Index(['publication', 'profile', 'created_at'])
export class Like extends RootEntity {
  @ManyToOne(() => Publication, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'publication_id' })
  publication: Publication;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  constructor(props?: Partial<Like>) {
    super();
    Object.assign(this, props);
  }
}
