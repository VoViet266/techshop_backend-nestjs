import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/user/interface/user.interface';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    protected configService: ConfigService;
    constructor(configService: ConfigService);
    validate(payload: IUser): Promise<{
        _id: string;
        name: string;
        email: string;
        avatar: string;
        branch: string;
        role: string;
        permission: any[];
    }>;
}
export {};
