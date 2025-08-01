import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/user/interface/user.interface';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserService } from 'src/user/user.service';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { MailService } from 'src/mail/mail.service';
export declare class AuthService {
    private jwtService;
    private userService;
    private configService;
    private mailService;
    private userModel;
    constructor(jwtService: JwtService, userService: UserService, configService: ConfigService, mailService: MailService, userModel: SoftDeleteModel<UserDocument>);
    validateUser(username: string, pass: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    createAccessToken(payload: any): Promise<string>;
    login(user: IUser, res: Response): Promise<{
        access_token: string;
        _id: string;
        name: string;
        email: string;
        avatar: string;
        branch: string;
        role: any;
    }>;
    createRefreshToken: (payload: object) => string;
    refreshToken: (refreshToken: string, res: Response) => Promise<{
        access_token: string;
        _id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
        avatar: string;
        branch: import("mongoose").Schema.Types.ObjectId;
        role: any;
        permission: any;
    }>;
    logout(res: Response, user: IUser): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
