import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
export declare const MongooseConfigService: {
    imports: (typeof ConfigModule)[];
    useFactory: (configService: ConfigService) => Promise<{
        uri: string;
        autoCreate: boolean;
        autoIndex: boolean;
        connectionFactory: (connection: Connection) => Connection;
    }>;
    inject: (typeof ConfigService)[];
};
