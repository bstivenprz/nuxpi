import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { UnixCreateTimestampColumn } from '../decorators/unix-timestamp-columns.decorator';

export class RootEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @UnixCreateTimestampColumn()
  created_at?: number;
}
