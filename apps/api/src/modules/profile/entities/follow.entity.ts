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

  static async find_followers_ids(
    current_profile_id: string,
  ): Promise<string[]> {
    const queryBuilder = (await Follow.createQueryBuilder('follow')
      .innerJoin('follow.follower', 'follower')
      .leftJoin(
        'follows',
        'auth_follow',
        'auth_follow.follower_id = :current_profile_id AND auth_follow.followed_id = follower.id',
        { current_profile_id },
      )
      .where('follow.followed_id = :current_profile_id', { current_profile_id })
      .select('follower.id', 'follower_id')
      .getRawMany()) as { follower_id: string }[];

    return queryBuilder.map((f) => f.follower_id);
  }
}
