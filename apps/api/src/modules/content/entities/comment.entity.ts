import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Publication } from './publication.entity';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { AuditableEntity } from '@/common/models/auditable-entity';
import { AutoMap } from '@automapper/classes';

@Entity('comments')
@Index(['publication', 'created_at'])
export class Comment extends AuditableEntity {
  @Column({ type: 'text' })
  content: string;

  /** autoMapIgnore */
  @ManyToOne(() => Publication, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'publication_id' })
  publication: Publication;

  @AutoMap(() => Profile)
  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: Profile;

  constructor(props?: Partial<Comment>) {
    super();
    Object.assign(this, props);
  }
}
