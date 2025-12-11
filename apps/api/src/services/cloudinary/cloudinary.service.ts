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
    options?: {
      folder?: string;
      public_id?: string;
      resource_type?: 'image' | 'video' | 'raw' | 'auto';
      transformation?: UploadApiOptions['transformation'];
    },
  ): Promise<UploadApiResponse> {
    const uploadOptions: UploadApiOptions = {
      folder: options?.folder || this.config.folder,
      public_id: options?.public_id,
      resource_type: options?.resource_type || 'image',
      transformation: options?.transformation,
      // chunk_size is used for large file uploads (files > 100MB)
      // Cloudinary will automatically use chunked upload when chunk_size is set
      chunk_size: 6000000, // 6MB chunks (minimum 5MB)
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

  getUrl(
    public_id: string,
    options?: { transformation?: Record<string, unknown> },
  ): string {
    return cloudinary.url(public_id, {
      secure: true,
      ...options?.transformation,
    });
  }
}
