"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisProvider = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
exports.RedisProvider = {
    provide: 'REDIS_CLIENT',
    useFactory: (configService) => {
        return new ioredis_1.default({
            host: 'redis-17023.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com',
            port: 17023,
            username: 'default',
            password: 'DQvsseSpWUyT5hXJhzcTums8aRwgxdpH',
        });
    },
};
//# sourceMappingURL=redis.provider.js.map