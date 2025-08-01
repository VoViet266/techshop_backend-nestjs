"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const bcrypt = __importStar(require("bcrypt"));
const otpGenerator = __importStar(require("otp-generator"));
const ioredis_1 = __importDefault(require("ioredis"));
const mail_service_1 = require("../mail/mail.service");
let UserService = class UserService {
    constructor(userModel, mailService, redisClient) {
        this.userModel = userModel;
        this.mailService = mailService;
        this.redisClient = redisClient;
        this.hashPassword = (password) => {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            return hash;
        };
        this.changePassword = async (changePassword, user) => {
            const userExist = await this.userModel.findById(user._id);
            if (!userExist) {
                throw new common_1.NotFoundException('User không tồn tại');
            }
            const isMatch = this.isValidPassword(changePassword.oldPassword, userExist.password);
            if (!isMatch) {
                throw new common_1.UnauthorizedException('Mật khẩu cũ không chính xác');
            }
            if (changePassword.newPassword !== changePassword.confirmPassword) {
                throw new common_1.ConflictException('Mật khẩu mới và xác nhận mật khẩu không khớp');
            }
            const hashedNewPassword = this.hashPassword(changePassword.newPassword);
            await this.userModel.updateOne({ _id: user._id }, { password: hashedNewPassword });
            return 'Mật Khẩu đã cập nhật thành công';
        };
        this.updateUserToken = async (id, refreshToken) => {
            await this.userModel.updateOne({ _id: id }, { refreshToken: refreshToken });
            return true;
        };
        this.findUserByRefreshToken = async (refresh_Token) => {
            const user = await this.userModel.findOne({
                refreshToken: refresh_Token,
            });
            return user;
        };
    }
    isValidPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    async create(createUserDto) {
        let roleId = createUserDto.role;
        const hashedPassword = this.hashPassword(createUserDto.password);
        return await this.userModel.create({
            ...createUserDto,
            password: hashedPassword,
            role: roleId,
        });
    }
    async register(registerDto) {
        try {
            const existingUser = await this.userModel.findOne({
                email: registerDto.email,
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email đã được sử dụng');
            }
            const hashedPassword = await this.hashPassword(registerDto.password);
            const tempUserData = {
                ...registerDto,
                password: hashedPassword,
            };
            const otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            });
            const tempUserKey = `temp_user:${registerDto.email}`;
            const otpKey = `otp:${registerDto.email}`;
            const pipeline = this.redisClient.pipeline();
            pipeline.setex(tempUserKey, 600, JSON.stringify(tempUserData));
            pipeline.setex(otpKey, 600, otp);
            await pipeline.exec();
            await this.mailService.sendOtpEmail(registerDto.email, otp);
            return {
                success: true,
                message: 'Vui lòng kiểm tra email để nhận mã xác thực',
                email: registerDto.email,
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Lỗi hệ thống khi đăng ký');
        }
    }
    async verifyOtp({ email, otp }) {
        try {
            const otpKey = `otp:${email}`;
            const tempUserKey = `temp_user:${email}`;
            const [storedOtp, tempUserData] = await Promise.all([
                this.redisClient.get(otpKey),
                this.redisClient.get(tempUserKey),
            ]);
            if (!storedOtp || !tempUserData) {
                throw new common_1.BadRequestException('Mã OTP không hợp lệ hoặc đã hết hạn');
            }
            if (storedOtp !== otp) {
                throw new common_1.BadRequestException('Mã OTP không chính xác');
            }
            const userData = JSON.parse(tempUserData);
            const newUser = await this.userModel.create(userData);
            const pipeline = this.redisClient.pipeline();
            pipeline.del(otpKey);
            pipeline.del(tempUserKey);
            await pipeline.exec();
            return {
                success: true,
                message: 'Xác thực thành công, tài khoản đã được tạo',
                user: {
                    id: newUser._id,
                    email: newUser.email,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.log(error);
            throw new common_1.InternalServerErrorException('Lỗi hệ thống khi xác thực OTP');
        }
    }
    async resendOtp(email) {
        try {
            const tempUserKey = `temp_user:${email}`;
            const tempUserData = await this.redisClient.get(tempUserKey);
            if (!tempUserData) {
                throw new common_1.BadRequestException('Không tìm thấy thông tin đăng ký, vui lòng đăng ký lại');
            }
            const newOtp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            });
            const otpKey = `otp:${email}`;
            await this.redisClient.setex(otpKey, 600, newOtp);
            await this.mailService.sendOtpEmail(email, newOtp);
            return {
                success: true,
                message: 'Đã gửi lại mã OTP mới',
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Lỗi hệ thống khi gửi lại OTP');
        }
    }
    async cleanupExpiredOtp() {
        try {
            const pattern = 'otp:*';
            const keys = await this.redisClient.keys(pattern);
            if (keys.length > 0) {
                await this.redisClient.del(keys);
            }
        }
        catch (error) {
            console.error('Error cleaning up expired OTPs:', error);
        }
    }
    findOne(id) {
        return this.userModel
            .findOne({ _id: id })
            .populate({
            path: 'role',
            populate: {
                path: 'permissions',
            },
        })
            .exec();
    }
    findOneByID(id) {
        return this.userModel.findById(id);
    }
    findOneByEmail(username) {
        return this.userModel.findOne({ email: username });
    }
    findAll() {
        return this.userModel.find().populate({
            path: 'role',
            populate: {
                path: 'permissions',
            },
        });
    }
    async findAllUserHasPermission() {
        const users = await this.userModel
            .find()
            .populate({
            path: 'role',
            populate: {
                path: 'permissions',
            },
        })
            .populate('branch');
        const usersWithPermissions = users.filter((user) => {
            return user.role?.permissions?.length > 0;
        });
        return usersWithPermissions;
    }
    async update(id, updateUserDto) {
        const userExist = await this.userModel.findOne({ _id: id });
        if (!userExist) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        if (updateUserDto.email && updateUserDto.email !== userExist.email) {
            const isExitEmail = await this.userModel.findOne({
                email: updateUserDto.email,
            });
            if (isExitEmail) {
                throw new common_1.NotFoundException(`Email: ${updateUserDto.email} đã tồn tại trên hệ thống xin vui lòng chọn email khác`);
            }
        }
        if (updateUserDto.password) {
            updateUserDto.password = this.hashPassword(updateUserDto.password);
        }
        return await this.userModel.updateOne({ _id: id }, { ...updateUserDto });
    }
    async updateRole(id, role) {
        const userExist = await this.userModel.findOne({ _id: id });
        if (!userExist) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        return await this.userModel.updateOne({ _id: id }, { role: role });
    }
    async remove(id) {
        if (!id) {
            throw new common_1.UnauthorizedException(`User with id ${id} not found`);
        }
        const userExist = await this.userModel.findOne({ _id: id });
        if (!userExist) {
            throw new common_1.UnauthorizedException(`User with id ${id} not found`);
        }
        return await this.userModel.softDelete({ _id: id });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [Object, mail_service_1.MailService,
        ioredis_1.default])
], UserService);
//# sourceMappingURL=user.service.js.map