import { OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';
export declare class MonitoringService implements OnModuleInit {
    private readonly registry;
    readonly httpRequestDurationMicroseconds: client.Histogram<string>;
    readonly httpRequestsTotal: client.Counter<string>;
    constructor();
    onModuleInit(): void;
    captureException(exception: any, context?: any): void;
    getMetrics(): Promise<string>;
}
