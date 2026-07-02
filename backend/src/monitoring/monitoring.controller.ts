import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { MonitoringService } from './monitoring.service';

@Controller('metrics')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  async getMetrics(@Res() res: Response) {
    res.set('Content-Type', 'text/plain; version=0.0.4');
    const metrics = await this.monitoringService.getMetrics();
    res.send(metrics);
  }
}
