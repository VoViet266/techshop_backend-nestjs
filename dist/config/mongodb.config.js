"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseConfigService = void 0;
const config_1 = require("@nestjs/config");
const soft_delete_plugin_mongoose_1 = require("soft-delete-plugin-mongoose");
exports.MongooseConfigService = {
    imports: [config_1.ConfigModule],
    useFactory: async (configService) => {
        const uri = configService.get('MONGODB_URI');
        return {
            uri,
            autoCreate: true,
            autoIndex: true,
            connectionFactory: (connection) => {
                connection.plugin(soft_delete_plugin_mongoose_1.softDeletePlugin);
                connection.on('connected', () => console.log('Data connected'));
                connection.on('disconnected', () => console.log('Data disconnected'));
                connection.on('open', () => console.log('Data open'));
                return connection;
            },
        };
    },
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=mongodb.config.js.map