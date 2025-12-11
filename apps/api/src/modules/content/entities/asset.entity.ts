import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Publication } from './publication.entity';
import { AuditableEntity } from '@/common/models/auditable-entity';
import { UnixTimestampColumn } from '@/common/decorators/unix-timestamp-columns.decorator';

export enum AssetType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum AssetStatus {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  FAILED = 'failed',
}

@Entity('assets')
@Index(['publication', 'created_at'])
export class Asset extends AuditableEntity {
  @Column({ type: 'enum', enum: AssetType, name: 'type' })
  type: AssetType;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: true,
    name: 'cloudinary_public_id',
  })
  cloudinary_public_id?: string;

  @Column({ nullable: true })
  width?: number;

  @Column({ nullable: true })
  height?: number;

  @Column({ nullable: true })
  diration?: number;

  @Column({ type: 'enum', enum: AssetStatus, default: AssetStatus.PENDING })
  status?: AssetStatus;

  @AutoMap(() => Publication)
  @ManyToOne(() => Publication, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'publication_id' })
  publication: Publication;

  constructor(props: Partial<Asset>) {
    super();
    Object.assign(this, props);
  }
}
