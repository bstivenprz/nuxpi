import { CloudinaryConfig } from '@/config/cloudinary.config';
import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
  UploadApiOptions,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  cloudinary = cloudinary;

  constructor(readonly config: CloudinaryConfig) {
    cloudinary.config({
      cloud_name: config.cloud_name,
      api_key: config.api_key,
      api_secret: config.api_secret,
      secure: true,
    });
  }

  async uploadImage(
    file: Buffer | string,
    options?: {
      folder?: string;
      public_id?: string;
      resource_type?: 'image' | 'video' | 'raw' | 'auto';
      transformation?: Record<string, unknown>;
    },
  ): Promise<UploadApiResponse> {
    const uploadOptions = {
      folder: options?.folder || this.config.folder,
      public_id: options?.public_id,
      resource_type: options?.resource_type || 'image',
      ...options?.transformation,
    };

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            reject(new Error(error.message));
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error('Upload failed: no result returned'));
          }
        },
      );

      if (Buffer.isBuffer(file)) {
        uploadStream.end(file);
      } else {
        uploadStream.end(Buffer.from(file, 'base64'));
      }
    });
  }

  async uploadVideo(
    file: Buffer | string,
    options?: {
      folder?: string;
      public_id?: string;
      transformation?: Record<string, unknown>;
    },
  ): Promise<UploadApiResponse> {
    return this.uploadImage(file, {
      ...options,
      resource_type: 'video',
    });
  }

  async deleteAsset(public_id: string): Promise<void> {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error(`Failed to delete asset: ${result.result}`);
    }
  }

  async uploadLarge(
    file: Buffer | string,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    const uploadOptions: UploadApiOptions = {
      folder: options?.folder || this.config.folder,
      public_id: options?.public_id,
      resource_type: options?.resource_type || 'image',
      transformation: options?.transformation,
      eager: options?.eager,
      eager_async: options?.eager_async,
      tags: options?.tags,
      // chunk_size is used for large file uploads (files > 100MB)
      // Cloudinary will automatically use chunked upload when chunk_size is set
      chunk_size: 6000000, // 6MB chunks (minimum 5MB)
      ...options,
    };

    return new Promise((resolve, reject) => {
      // Use upload_stream for large file uploads (up to 1GB)
      // When chunk_size is specified, Cloudinary handles chunking automatically
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            reject(new Error(error.message));
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error('Upload failed: no result returned'));
          }
        },
      );

      if (Buffer.isBuffer(file)) {
        uploadStream.end(file);
      } else {
        uploadStream.end(Buffer.from(file, 'base64'));
      }
    });
  }

  async update(
    public_id: string,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.explicit(
        public_id,
        {
          ...options,
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            reject(new Error(error.message));
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error('Update failed: no result returned'));
          }
        },
      );
    });
  }

  url(
    public_id: string,
    options?: { transformation?: Record<string, unknown> },
  ): string {
    return cloudinary.url(public_id, {
      secure: true,
      ...options?.transformation,
    });
  }

  /**
   * Get the public URL for an asset using its Cloudinary public_id
   * @param public_id The Cloudinary public_id
   * @returns The public URL of the asset
   */
  getPublicUrl(
    public_id: string,
    resource_type?: 'image' | 'video',
    effect?: string,
  ): string {
    return cloudinary.url(public_id, {
      secure: true,
      resource_type: resource_type,
      effect: effect,
    });
  }

  /**
   * Get a placeholder URL for an asset (blur/low quality) suitable for Next.js Image component
   * Uses Cloudinary transformations to generate a tiny, blurred version
   * @param public_id The Cloudinary public_id
   * @returns A low-quality placeholder URL
   */
  getPlaceholderUrl(public_id: string): string {
    return cloudinary.url(public_id, {
      secure: true,
      transformation: [
        {
          width: 20,
          height: 20,
          crop: 'fill',
          quality: 'auto:low',
          effect: 'blur:1000',
          fetch_format: 'auto',
        },
      ],
    });
  }

  /**
   * Get a base64-encoded blur data URL for Next.js Image component
   * Fetches a tiny, blurred version of the image and converts it to base64
   * @param public_id The Cloudinary public_id
   * @returns A base64 data URL (e.g., "data:image/jpeg;base64,...")
   */
  async getPlaceholderDataUrl(public_id: string): Promise<string> {
    const placeholderUrl = this.getPlaceholderUrl(public_id);

    try {
      const response = await fetch(placeholderUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch placeholder: ${response.statusText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const base64 = buffer.toString('base64');
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      // Fallback to a simple 1x1 transparent pixel if fetch fails
      const fallbackBase64 =
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      return `data:image/png;base64,${fallbackBase64}`;
    }
  }
}
