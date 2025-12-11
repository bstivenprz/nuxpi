import { UnixTimestampColumn } from '@/common/decorators/unix-timestamp-columns.decorator';
import { AuditableEntity } from '@/common/models/auditable-entity';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { AutoMap } from '@automapper/classes';
import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Asset } from './asset.entity';

export enum PublicationType {
  MULTIMEDIA = 'multimedia',
  TEXT = 'text',
}

@Entity('publications')
@Index(['author', 'created_at'])
export class Publication extends AuditableEntity {
  @Column({
    type: 'enum',
    enum: PublicationType,
    default: PublicationType.TEXT,
  })
  type: PublicationType;

  @Column({ type: 'text', nullable: true })
  caption?: string;

  @AutoMap(() => [Asset])
  @OneToMany(() => Asset, (asset) => asset.publication, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  assets: Asset[];

  @AutoMap(() => Profile)
  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: Profile;

  @Column({ type: 'boolean', default: false })
  is_locked: boolean;

  @Column({ type: 'numeric', nullable: true })
  price?: number;

  @UnixTimestampColumn({ nullable: true })
  unlock_date?: Date;

  @Column({ type: 'integer', default: 0 })
  sales_count: number;

  @Column({ type: 'integer', default: 0 })
  likes_count: number;

  @Column({ type: 'integer', default: 0 })
  comments_count: number;

  @Column({ type: 'integer', default: 0 })
  views_count: number;

  constructor(props?: Partial<Publication>) {
    super();
    Object.assign(this, props);
  }
}
