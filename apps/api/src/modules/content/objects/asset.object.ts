import { AutoMap } from '@automapper/classes';
import { AssetType } from '../entities/asset.entity';

export class AssetObject {
  @AutoMap(() => String)
  type: AssetType;

  cloudinary_public_id: string;
  width: number;
  height: number;
  duration: number;
}
