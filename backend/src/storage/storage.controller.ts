import { Controller, Post, Get, Param, Body, UseGuards, Query } from '@nestjs/common';
import { StorageService } from './storage.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';

@UseGuards(SupabaseAuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-url')
  async getUploadUrl(@Body() body: { bucket: string; filename: string }) {
    return this.storageService.createUploadUrl(body.bucket, body.filename);
  }

  @Get('download-url')
  async getDownloadUrl(@Query('bucket') bucket: string, @Query('path') path: string) {
    const url = await this.storageService.getDownloadUrl(bucket, path);
    return { url };
  }
}
