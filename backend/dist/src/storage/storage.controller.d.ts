import { StorageService } from './storage.service';
export declare class StorageController {
    private readonly storageService;
    constructor(storageService: StorageService);
    getUploadUrl(body: {
        bucket: string;
        filename: string;
    }): Promise<{
        signedUrl: string;
        path: string;
    }>;
    getDownloadUrl(bucket: string, path: string): Promise<{
        url: string;
    }>;
}
