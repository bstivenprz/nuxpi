import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Session('profile_id') profile_id: string,
    @Session('username') username: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<void> {
    if (!file) {
      throw new Error('No file provided');
    }

    const width = Number(req.body?.width);
    const height = Number(req.body?.height);

    if (!width || !height || isNaN(width) || isNaN(height)) {
      throw new Error('Valid width and height are required');
    }

    await this.commandBus.execute(
      new UploadAssetCommand(profile_id, username, file, width, height),
    );
  }
}
