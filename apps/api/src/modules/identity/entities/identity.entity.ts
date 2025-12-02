import { UnixTimestampColumn } from '@/common/decorators/unix-timestamp-columns.decorator';
import { RootEntity } from '@/common/models/root-entity';
import { Account } from '@/modules/profile/entities/account.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('identities')
export class Identity extends RootEntity {
  @Column()
  uuid: string;

  @Column('boolean', { default: false })
  is_synced: boolean;

  @Column('boolean', { default: false })
  is_deleted: boolean;

  @UnixTimestampColumn({ nullable: true })
  deleted_at?: Date | null;

  @OneToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn()
  account: Account;
}
