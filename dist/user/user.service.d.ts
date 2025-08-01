import { ChangePasswordDto, CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument, User as userModel } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './interface/user.interface';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { MailService } from 'src/mail/mail.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class UserService {
    private readonly userModel;
    private readonly mailService;
    private readonly redisClient;
    constructor(userModel: SoftDeleteModel<UserDocument>, mailService: MailService, redisClient: Redis);
    hashPassword: (password: string) => string;
    isValidPassword(password: string, hash: string): Promise<boolean>;
    create(createUserDto: CreateUserDto): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    register(registerDto: RegisterUserDto): Promise<{
        success: boolean;
        message: string;
        email: string;
    }>;
    verifyOtp({ email, otp }: VerifyOtpDto): Promise<{
        success: boolean;
        message: string;
        user: {
            id: mongoose.Types.ObjectId;
            email: string;
        };
    }>;
    resendOtp(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    cleanupExpiredOtp(): Promise<void>;
    changePassword: (changePassword: ChangePasswordDto, user: IUser) => Promise<string>;
    updateUserToken: (id: string, refreshToken: string) => Promise<boolean>;
    findOne(id: string): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    findOneByID(id: string): mongoose.Query<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, {}, mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    }, "findOne">;
    findOneByEmail(username: string): mongoose.Query<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, {}, mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    }, "findOne">;
    findAll(): mongoose.Query<Omit<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, never>[], mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, {}, mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    }, "find">;
    findAllUserHasPermission(): Promise<Omit<Omit<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, never>, never>[]>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<mongoose.UpdateWriteOpResult>;
    updateRole(id: string, role: string): Promise<mongoose.UpdateWriteOpResult>;
    findUserByRefreshToken: (refresh_Token: string) => Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, userModel> & userModel & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    remove(id: string): Promise<{
        deleted: number;
    }>;
}
