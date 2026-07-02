"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let StorageService = StorageService_1 = class StorageService {
    configService;
    supabase;
    logger = new common_1.Logger(StorageService_1.name);
    constructor(configService) {
        this.configService = configService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_SERVICE_ROLE_KEY');
        if (!supabaseUrl || !supabaseKey) {
            this.logger.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing. Storage functions will fail if called.');
        }
        else {
            this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        }
    }
    async createUploadUrl(bucket, path) {
        if (!this.supabase) {
            throw new common_1.InternalServerErrorException('Storage service is not configured with Supabase credentials.');
        }
        const { data, error } = await this.supabase.storage
            .from(bucket)
            .createSignedUploadUrl(path);
        if (error) {
            this.logger.error(`Failed to create upload URL for bucket ${bucket}:`, error);
            throw new common_1.InternalServerErrorException('Could not generate upload URL');
        }
        return { signedUrl: data.signedUrl, path: data.path };
    }
    async getDownloadUrl(bucket, path, expiresIn = 3600) {
        if (!this.supabase) {
            throw new common_1.InternalServerErrorException('Storage service is not configured with Supabase credentials.');
        }
        const { data, error } = await this.supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);
        if (error) {
            this.logger.error(`Failed to create download URL for bucket ${bucket}:`, error);
            throw new common_1.InternalServerErrorException('Could not generate download URL');
        }
        return data.signedUrl;
    }
    async uploadFile(bucket, path, file, mimetype) {
        if (!this.supabase) {
            throw new common_1.InternalServerErrorException('Storage service is not configured with Supabase credentials.');
        }
        const arrayBuffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);
        let result = await this.supabase.storage
            .from(bucket)
            .upload(path, arrayBuffer, {
            contentType: mimetype,
            upsert: true
        });
        if (result.error) {
            if (result.error.statusCode === '404' || result.error.message?.includes('Bucket not found')) {
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
                throw new common_1.InternalServerErrorException('Could not upload file');
            }
        }
        return result.data;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map