import { AuditableEntity } from '@/common/models/auditable-entity';
import { Account } from '@/modules/profile/entities/account.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('wallets')
export class Wallet extends AuditableEntity {
  @Column({ type: 'numeric', default: 0 })
  balance: number;

  @Column({ type: 'numeric', default: 0 })
  retained_balance: number;

  /** @autoMapIgnore */
  @OneToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  constructor(props?: Partial<Wallet>) {
    super();
    Object.assign(this, props);
  }
}
