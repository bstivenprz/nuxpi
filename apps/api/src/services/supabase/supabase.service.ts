import { SupabaseConfig } from '@/config/supabase.config';
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  readonly supabase: SupabaseClient;

  constructor(readonly config: SupabaseConfig) {
    this.supabase = createClient(config.url, config.service_key);
  }

  async updateUser(uid: string, user_metadata: Record<string, any>) {
    const { error } = await this.supabase.auth.admin.updateUserById(uid, {
      user_metadata,
    });

    if (error) throw new Error(error.message);
  }
}
