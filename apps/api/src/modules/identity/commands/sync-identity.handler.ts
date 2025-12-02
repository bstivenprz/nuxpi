import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SyncIdentityCommand } from './sync-identity.command';
import { Identity } from '../entities/identity.entity';
import { SupabaseService } from '@/services/supabase/supabase.service';
import { Account } from '@/modules/profile/entities/account.entity';
import { Profile } from '@/modules/profile/entities/profile.entity';

@CommandHandler(SyncIdentityCommand)
export class SyncIdentityCommandHandler
  implements ICommandHandler<SyncIdentityCommand, void>
{
  constructor(private readonly supabase: SupabaseService) {}

  async execute(command: SyncIdentityCommand): Promise<void> {
    const { email, name, username, uuid } = command;

    if (await Identity.existsBy({ uuid })) return;

    const account = new Account();
    account.name = name;
    account.email = email;
    account.profile = new Profile();
    account.profile.username =
      username ?? email.split('@')[0].toLowerCase().trim();
    account.profile.name = name;
    await account.save();

    const identity = new Identity();
    identity.uuid = uuid;
    identity.is_synced = true;
    identity.account = account;
    await identity.save();

    await this.supabase.updateUser(uuid, {
      account_id: account.id,
      profile_id: account.profile.id,
      is_synced: true,
    });
  }
}
