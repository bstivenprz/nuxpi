import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadAssetCommand } from './upload-asset.command';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { Asset, AssetType } from '../entities/asset.entity';
import { AssetObject } from '../objects/asset.object';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { randomUUID } from 'crypto';

@CommandHandler(UploadAssetCommand)
export class UploadAssetCommandHandler
  implements ICommandHandler<UploadAssetCommand, AssetObject>
{
  @InjectMapper() mapper: Mapper;

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  private calculateFontSize(width: number, height: number): number {
    const minDimension = Math.min(width, height);
    const calculatedSize = Math.floor(minDimension * 0.03);
    return Math.max(16, Math.min(72, calculatedSize));
  }

  async execute(command: UploadAssetCommand): Promise<AssetObject> {
    const { username, file, width, height } = command;

    const isVideo = file.mimetype.startsWith('video/');
    const assetType = isVideo ? AssetType.VIDEO : AssetType.IMAGE;

    const watermarkText = `nuxpi.com/u/${username}`;

    const id = randomUUID();

    const fontSize = this.calculateFontSize(width, height);

    const result = await this.cloudinaryService.uploadLarge(file.buffer, {
      public_id: `${assetType}s/${id}`,
      resource_type: assetType,
      tags: [username],
      transformation: [
        {
          overlay: 'watermark',
          gravity: 'south_east',
          width: '0.05',
          flags: ['relative'],
          opacity: 60,
        },
        {
          overlay: {
            font_family: 'Arial',
            font_size: fontSize,
            text: watermarkText,
            font_weight: 'bold',
          },
          color: 'white',
          gravity: 'south_east',
          y: 30, // nudge above watermark image
          opacity: 100,
        },
      ],
    });

    const asset = new Asset({
      id,
      type: assetType,
      cloudinary_public_id: result.public_id,
      width: result.width,
      height: result.height,
    });

    return this.mapper.map(asset, Asset, AssetObject);
  }
}
