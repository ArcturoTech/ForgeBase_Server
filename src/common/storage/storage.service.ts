import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export type StoredObject = {
  url: string;
  key: string;
  resourceType: string;
};

@Injectable()
export class StorageService implements OnModuleInit {
  private baseFolder: string;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    this.baseFolder = this.config.get<string>('cloudinary.folder') ?? 'forgebase';
    cloudinary.config({
      cloud_name: this.config.get<string>('cloudinary.cloudName'),
      api_key: this.config.get<string>('cloudinary.apiKey'),
      api_secret: this.config.get<string>('cloudinary.apiSecret'),
      secure: true,
    });
  }

  saveFile(buffer: Buffer, originalName: string, subfolder?: string): Promise<StoredObject> {
    const folder = subfolder ? `${this.baseFolder}/${subfolder}` : this.baseFolder;
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          use_filename: true,
          unique_filename: true,
          filename_override: originalName,
        },
        (error, result) => {
          if (error || !result) {
            reject(new InternalServerErrorException('Falha ao enviar o arquivo'));
            return;
          }
          resolve({
            url: result.secure_url,
            key: result.public_id,
            resourceType: result.resource_type,
          });
        },
      );
      upload.end(buffer);
    });
  }

  async removeFile(key: string, resourceType: string): Promise<void> {
    await cloudinary.uploader.destroy(key, { resource_type: resourceType, invalidate: true });
  }
}
