import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus } from '@nestjs/cqrs';
import { UploadAssetCommand } from '../commands/upload-asset.command';
import { Session } from '@/auth/decorators/session.decorator';
import { Request } from 'express';

@Controller('assets')
export class AssetsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Session('profile_id') profile_id: string,
    @Session('username') username: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new Error('No file provided');
    }

    const width = Number(req.body?.width);
    const height = Number(req.body?.height);
    const is_private = req.body?.is_private === 'true';

    if (!width || !height || isNaN(width) || isNaN(height)) {
      throw new Error('Valid width and height are required');
    }

    return await this.commandBus.execute(
      new UploadAssetCommand(
        profile_id,
        username,
        file,
        width,
        height,
        is_private,
      ),
    );
  }
}
