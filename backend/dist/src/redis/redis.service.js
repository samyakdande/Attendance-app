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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("@nestjs/config");
let RedisService = RedisService_1 = class RedisService extends ioredis_1.default {
    configService;
    logger = new common_1.Logger(RedisService_1.name);
    hasLoggedError = false;
    constructor(configService) {
        super(configService.get('REDIS_URL') || 'redis://localhost:6379', {
            lazyConnect: true,
            retryStrategy(times) {
                return 5000;
            },
            maxRetriesPerRequest: 0,
        });
        this.configService = configService;
        this.on('error', (err) => {
            if (!this.hasLoggedError) {
                const msg = err?.message || err?.name || 'Connection Refused';
                this.logger.error(`Redis connection failed: ${msg}. Please ensure Redis is running or REDIS_URL is configured.`);
                this.hasLoggedError = true;
            }
        });
        this.on('connect', () => {
            this.logger.log('Connected to Redis successfully');
            this.hasLoggedError = false;
        });
    }
    onModuleDestroy() {
        this.disconnect();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map