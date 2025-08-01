import { AuthService } from './auth.service';
import { IUser } from 'src/user/interface/user.interface';
import { RegisterUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { VerifyOtpDto } from 'src/user/dto/verify-otp.dto';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly configService;
    constructor(authService: AuthService, userService: UserService, configService: ConfigService);
    handleLogin(req: any, res: Response): Promise<{
        access_token: string;
        _id: string;
        name: string;
        email: string;
        avatar: string;
        branch: string;
        role: any;
    }>;
    register(register: RegisterUserDto): Promise<{
        success: boolean;
        message: string;
        email: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any, res: Response): Promise<{
        message: string;
    }>;
    handleGetAccount(user: IUser): import("mongoose").Query<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../user/schemas/user.schema").User> & import("../user/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("../user/schemas/user.schema").User> & import("../user/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../user/schemas/user.schema").User> & import("../user/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("../user/schemas/user.schema").User> & import("../user/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("../user/schemas/user.schema").User> & import("../user/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    }, "findOne">;
    handleRefreshToken(request: Request & {
        cookies: {
            [key: string]: string;
        };
    }, res: Response): Promise<{
        access_token: string;
        _id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
        avatar: string;
        branch: import("mongoose").Schema.Types.ObjectId;
        role: any;
        permission: any;
    }>;
    handleLogout(res: Response, user: IUser): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<string>;
    resetPassword(token: string, password: string): Promise<{
        message: string;
    }>;
    resendOtp(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        success: boolean;
        message: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
        };
    }>;
}
