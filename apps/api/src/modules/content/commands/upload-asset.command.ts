import { ICommand } from '@nestjs/cqrs';

export class UploadAssetCommand implements ICommand {
  constructor(
    readonly profile_id: string,
    readonly username: string,
    readonly file: Express.Multer.File,
  ) {}
}
