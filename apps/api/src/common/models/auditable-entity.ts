import {
  BaseEntity,
  BeforeSoftRemove,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import {
  UnixCreateTimestampColumn,
  UnixDeleteTimestampColumn,
  UnixTimestampColumn,
} from '../decorators/unix-timestamp-columns.decorator';

export class AuditableEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @UnixCreateTimestampColumn()
  created_at?: Date;

  @AutoMap()
  @UnixTimestampColumn({
    default: () => 'EXTRACT(EPOCH FROM now())',
  })
  updated_at?: Date;

  @UnixDeleteTimestampColumn({ nullable: true })
  deleted_at?: Date | null = null;

  @Column({ default: false })
  is_deleted?: boolean = false;

  @VersionColumn()
  version?: number;

  @BeforeUpdate()
  beforeUpdate() {
    this.updated_at = new Date();
  }

  @BeforeSoftRemove()
  softDelete() {
    this.is_deleted = true;
  }
}
