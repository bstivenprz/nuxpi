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
    const calculatedSize = Math.floor(minDimension * 0.02);
    return Math.max(16, Math.min(72, calculatedSize));
  }

  async execute(command: UploadAssetCommand): Promise<AssetObject> {
    const { username, file, width, height } = command;

    const isVideo = file.mimetype.startsWith('video/');
    const assetType = isVideo ? AssetType.VIDEO : AssetType.IMAGE;

    const id = randomUUID();

    const result = await this.cloudinaryService.uploadLarge(file.buffer, {
      public_id: `${assetType}s/${id}`,
      resource_type: assetType,
      tags: [username],
      transformation: [
        {
          overlay: 'watermark',
          gravity: 'north_east',
          width: '0.05',
          flags: ['relative'],
          opacity: 60,
          x: 0.02,
          y: 0.02,
        },
        {
          overlay: {
            font_family: 'Roboto',
            font_size: this.calculateFontSize(width, height),
            font_weight: 'medium',
            text: `nuxpi.com/u/${username}`,
          },
          color: 'white',
          gravity: 'south_east',
          opacity: 40,
          x: 10,
          y: 15,
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
