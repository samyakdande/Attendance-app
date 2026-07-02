import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';
import * as Sentry from '@sentry/node';

@Injectable()
export class MonitoringService implements OnModuleInit {
  private readonly registry: client.Registry;

  public readonly httpRequestDurationMicroseconds: client.Histogram<string>;
  public readonly httpRequestsTotal: client.Counter<string>;

  constructor() {
    this.registry = new client.Registry();
    client.collectDefaultMetrics({ register: this.registry });

    this.httpRequestDurationMicroseconds = new client.Histogram({
      name: 'http_request_duration_ms',
      help: 'Duration of HTTP requests in ms',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [10, 50, 100, 200, 500, 1000, 2000, 5000],
    });

    this.httpRequestsTotal = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.registry.registerMetric(this.httpRequestDurationMicroseconds);
    this.registry.registerMetric(this.httpRequestsTotal);
  }

  onModuleInit() {
    // Basic Sentry setup is expected in main.ts, this ensures Sentry is active for custom logging
  }

  captureException(exception: any, context?: any) {
    Sentry.captureException(exception, { extra: context });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
