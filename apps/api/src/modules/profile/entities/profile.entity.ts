import { AuditableEntity } from '@/common/models/auditable-entity';
import { AutoMap } from '@automapper/classes';
import { Column, Entity, Index } from 'typeorm';

@Entity('profiles')
export class Profile extends AuditableEntity {
  @Column()
  name: string;

  @Index()
  @Column()
  username: string;

  @Column({ nullable: true })
  presentation?: string | null;

  @AutoMap(() => String)
  @Column('enum', {
    enum: ['male', 'female', 'lgbtiq', 'prefer_not_say'],
    nullable: true,
  })
  gender?: 'male' | 'female' | 'lgbtiq' | 'prefer_not_say';

  @Column({ nullable: true })
  cover?: string | null;

  @Column({ nullable: true })
  picture?: string | null;

  @Column({ default: false })
  is_creator: boolean;

  @Column({ default: 0 })
  followers_count?: number;
}
