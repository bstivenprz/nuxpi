import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus } from '@nestjs/cqrs';
import { UploadAssetCommand } from '../commands/upload-asset.command';
import { Session } from '@/auth/decorators/session.decorator';

@Controller('assets')
export class AssetsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Session('profile_id') profile_id: string,
    @Session('username') username: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file provided');
    }

    return this.commandBus.execute(
      new UploadAssetCommand(profile_id, username, file),
    );
  }
}
