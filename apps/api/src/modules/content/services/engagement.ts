import { Injectable } from '@nestjs/common';

class Activity {
  publications_count: number;
  publications_last_25h: number;
  publications_last_7d: number;
  publications_last_30d: number;
  avg_engagement_rate: number;
  followers_count: number;
  account_age_days: number;
}

class PublicationStats {
  likes_count: number;
  comments_count: number;
  sales_count: number;
  views_count: number;
}

@Injectable()
export class EngagementRankerService {
  velocity(stats: PublicationStats, created_at: Date) {
    const now = Date.now() / 1000;
    const age_hours = Math.max((now - created_at.getTime()) / 3600, 1);

    const total_egagement =
      stats.likes_count +
      stats.comments_count * 2 +
      stats.sales_count * 3 +
      stats.views_count * 0.1;

    const velocity = total_egagement / age_hours;

    let recency_boost = 1.0;
    if (age_hours < 6) {
      recency_boost = 2.0 - age_hours / 6;
    }

    let time_penalty = 1.0;
    if (age_hours > 24) {
      const days_old = age_hours / 24;
      time_penalty = Math.exp(-0.2 * days_old);
    }

    return velocity * recency_boost * time_penalty;
  }

  time_decay(stats: PublicationStats, created_at: Date, gravity: number = 1.5) {
    const now = Date.now() / 1000;
    const age_hours = Math.max((now - created_at.getTime()) / 3600, 1);

    const engagement =
      stats.likes_count * 1 +
      stats.comments_count * 2 +
      stats.sales_count * 5 +
      stats.views_count * 0.1;

    const score = engagement / Math.pow(age_hours + 2, gravity);

    return score;
  }

  consistency_boost(
    activity: Activity,
    base_score: number = 0.0,
    boost_factor: number = 0.3,
  ) {
    const daily_avg = activity.publications_last_7d / 7;
    const weekly_avg = activity.publications_last_30d / 4.29;

    const consistency = Math.min(daily_avg / (weekly_avg + 1), 1);

    const consistency_boost = 1 + consistency * boost_factor;

    const score = base_score * consistency_boost;

    return score;
  }

  quality_boost(
    activity: Activity,
    quality_weight: number = 0.3,
    quantity_weight: number = 0.7,
  ) {
    const normalized_publications =
      Math.log10(activity.publications_count + 1) * 10;

    const quality_score = activity.avg_engagement_rate;

    const score =
      normalized_publications * quantity_weight +
      quality_score * quality_weight;

    return score;
  }
}
