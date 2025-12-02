import { UnixTimestampColumn } from '@/common/decorators/unix-timestamp-columns.decorator';
import { AuditableEntity } from '@/common/models/auditable-entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity('accounts')
export class Account extends AuditableEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string | null;

  @Column({ nullable: true })
  country_code?: string;

  @UnixTimestampColumn({ nullable: true })
  birth_date?: Date | null;

  @OneToOne(() => Profile, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  profile: Profile;
}
