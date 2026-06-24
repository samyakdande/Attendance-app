"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    logger = new common_1.Logger('ExceptionFilter');
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : { message: 'Internal Server Error' };
        const requestId = request.requestId || 'unknown-request';
        const userId = request.user?.id || 'anonymous';
        const institutionId = request.user?.institutionId || 'unknown';
        const logPayload = {
            requestId,
            timestamp: new Date().toISOString(),
            userId,
            institutionId,
            route: request.url,
            method: request.method,
            statusCode: status,
            errorName: exception instanceof Error ? exception.name : 'UnknownError',
            errorMessage: exception instanceof Error ? exception.message : 'Unknown exception',
            stackTrace: exception instanceof Error ? exception.stack : undefined
        };
        if (status >= 500) {
            this.logger.error(JSON.stringify(logPayload));
        }
        else {
            this.logger.warn(JSON.stringify(logPayload));
        }
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            requestId,
            error: errorResponse,
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map