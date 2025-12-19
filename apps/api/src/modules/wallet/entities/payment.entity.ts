import { AuditableEntity } from '@/common/models/auditable-entity';
import { Account } from '@/modules/profile/entities/account.entity';
import { AutoMap } from '@automapper/classes';
import { Entity, Index, Column, ManyToOne, JoinColumn } from 'typeorm';
import * as crypto from 'crypto';
import { PaymentEventObject } from '../objects/payment-event.object';

export enum PaymentStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  VOIDED = 'VOIDED',
  ERROR = 'ERROR',
}

@Entity('payments')
export class Payment extends AuditableEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  reference: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 8 })
  currency: string;

  @Column({ type: 'varchar', length: 255 })
  hash: string;

  @Index()
  @Column({ type: 'varchar', nullable: true, default: null })
  payment_id?: string | null = null;

  @Column({ type: 'varchar', nullable: true, default: null })
  payment_method?: string | null = null;

  @AutoMap(() => String)
  @Column({
    type: 'enum',
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.PENDING,
  })
  status: PaymentStatusEnum;

  /** @autoMapIgnore */
  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  constructor(amount: number, currency: string, account: Account) {
    super();
    this.amount = amount;
    this.currency = currency;
    this.account = account;
    this.reference = this.createReference();
  }

  createReference(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  createSignature(integrity_key: string): string {
    const params = [
      this.reference,
      this.amount,
      this.currency,
      integrity_key,
    ].join('');
    return crypto.createHash('sha256').update(params).digest('hex');
  }

  validateSignature(
    event: PaymentEventObject,
    checksum: string,
    event_key: string,
  ): boolean {
    const signature_properties = event.signature.properties;
    const event_timestamp = event.timestamp;

    if (!signature_properties || !event_timestamp || !event_key) return false;

    const transaction_properties = signature_properties.map((property) =>
      this.getPropertyByPath(event.data, property),
    );
    const signature =
      transaction_properties.join('') + event_timestamp + event_key;

    const digest = crypto.createHash('sha256').update(signature).digest('hex');

    return digest === checksum;
  }

  private getPropertyByPath(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}
