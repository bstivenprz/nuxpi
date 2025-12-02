import { RootEntity } from '@/common/models/root-entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity('follows')
export class Follow extends RootEntity {
  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'follower_id' })
  follower: Profile;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'followed_id' })
  followed: Profile;
}
