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

export enum Audience {
  EVERYONE = 'everyone',
  PAID_ONLY = 'paid-only',
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

  @Column({ type: 'numeric', nullable: true })
  price?: number;

  @Column({ type: 'enum', enum: Audience, default: Audience.EVERYONE })
  audience: Audience;

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
