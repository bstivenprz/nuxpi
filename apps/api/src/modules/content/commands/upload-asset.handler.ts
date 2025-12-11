import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadAssetCommand } from './upload-asset.command';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { randomUUID } from 'crypto';
import { AssetType } from '../entities/asset.entity';

export interface UploadAssetResult {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  duration?: number;
  type: AssetType;
}

@CommandHandler(UploadAssetCommand)
export class UploadAssetCommandHandler
  implements ICommandHandler<UploadAssetCommand, UploadAssetResult>
{
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async execute(command: UploadAssetCommand): Promise<UploadAssetResult> {
    const { username, file } = command;

    // Determine asset type from mimetype
    const isVideo = file.mimetype.startsWith('video/');
    const assetType = isVideo ? AssetType.VIDEO : AssetType.IMAGE;

    // Generate UUID for public_id
    const uuid = randomUUID();

    // Format public_id: videos/{username}/{uuid} or images/{username}/{uuid}
    const public_id = `${assetType}s/${username}/${uuid}`;

    // Create watermark transformation text
    const watermarkText = `nuxpi.com/u/${username}`;

    // Upload with chunk support for large files (up to 1GB)
    // Add watermark text in bottom right corner with white 60% opacity
    const result = await this.cloudinaryService.uploadLarge(
      file.buffer,
      {
        public_id,
        resource_type: assetType,
        transformation: [
          {
            overlay: {
              font_family: 'Arial',
              font_size: 16,
              text: watermarkText,
            },
            color: 'white',
            opacity: 60,
            gravity: 'south_east',
            x: 10,
            y: 10,
          },
        ],
      },
    );

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      duration: result.duration,
      type: assetType,
    };
  }
}
