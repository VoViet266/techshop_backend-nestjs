"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisProvider = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("@nestjs/config");
exports.RedisProvider = {
    provide: 'REDIS_CLIENT',
    useFactory: (configService) => {
        return new ioredis_1.default({
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            username: configService.get('REDIS_USERNAME'),
            password: configService.get('REDIS_PASSWORD'),
        });
    },
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=redis.provider.js.map