import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private readonly supabase?: SupabaseClient;
  private readonly logger = new Logger(StorageService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing. Storage functions will fail if called.');
    } else {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  /**
   * Generates a signed URL for uploading a file directly from the client to Supabase Storage.
   * This offloads the file transfer completely from the Node.js backend.
   */
  async createUploadUrl(bucket: string, path: string): Promise<{ signedUrl: string, path: string }> {
    if (!this.supabase) {
      throw new InternalServerErrorException('Storage service is not configured with Supabase credentials.');
    }

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) {
      this.logger.error(`Failed to create upload URL for bucket ${bucket}:`, error);
      throw new InternalServerErrorException('Could not generate upload URL');
    }

    return { signedUrl: data.signedUrl, path: data.path };
  }

  /**
   * Generates a temporary signed URL to download a private file.
   */
  async getDownloadUrl(bucket: string, path: string, expiresIn = 3600): Promise<string> {
    if (!this.supabase) {
      throw new InternalServerErrorException('Storage service is not configured with Supabase credentials.');
    }

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      this.logger.error(`Failed to create download URL for bucket ${bucket}:`, error);
      throw new InternalServerErrorException('Could not generate download URL');
    }

    return data.signedUrl;
  }

  /**
   * Uploads a file directly from the backend to Supabase Storage.
   */
  async uploadFile(bucket: string, path: string, file: Buffer, mimetype: string): Promise<any> {
    if (!this.supabase) {
      throw new InternalServerErrorException('Storage service is not configured with Supabase credentials.');
    }

    // Convert Node Buffer to standard ArrayBuffer to ensure native fetch compatibility
    const arrayBuffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;

    let result = await this.supabase.storage
      .from(bucket)
      .upload(path, arrayBuffer, {
        contentType: mimetype,
        upsert: true
      });

    if (result.error) {
      // If bucket doesn't exist, try to create it and retry
      if ((result.error as any).statusCode === '404' || result.error.message?.includes('Bucket not found')) {
        this.logger.log(`Bucket ${bucket} not found, attempting to create it...`);
        await this.supabase.storage.createBucket(bucket, { public: false });
        
        result = await this.supabase.storage
          .from(bucket)
          .upload(path, file, {
            contentType: mimetype,
            upsert: true
          });
      }
      
      if (result.error) {
        this.logger.error(`Failed to upload file to bucket ${bucket}:`, result.error);
        throw new InternalServerErrorException('Could not upload file');
      }
    }

    return result.data;
  }
}
