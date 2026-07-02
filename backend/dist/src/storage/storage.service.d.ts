import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private configService;
    private readonly supabase?;
    private readonly logger;
    constructor(configService: ConfigService);
    createUploadUrl(bucket: string, path: string): Promise<{
        signedUrl: string;
        path: string;
    }>;
    getDownloadUrl(bucket: string, path: string, expiresIn?: number): Promise<string>;
    uploadFile(bucket: string, path: string, file: Buffer, mimetype: string): Promise<any>;
}
