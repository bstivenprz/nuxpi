import { AutoMap } from '@automapper/classes';
import { AssetType } from '../entities/asset.entity';

export class AssetObject {
  id: string;
  @AutoMap(() => String)
  type: AssetType;
  cloudinary_public_id: string;
  public_url: string;
  placeholder_url: string;
  width: number;
  height: number;
  duration: number;
}
