"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const ms_1 = __importDefault(require("ms"));
const crypto_1 = require("crypto");
const mongoose_1 = require("@nestjs/mongoose");
const user_service_1 = require("../user/user.service");
const user_schema_1 = require("../user/schemas/user.schema");
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    constructor(jwtService, userService, configService, mailService, userModel) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.configService = configService;
        this.mailService = mailService;
        this.userModel = userModel;
        this.createRefreshToken = (payload) => {
            const refresh_Token = this.jwtService.sign(payload, {
                secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
                expiresIn: (0, ms_1.default)(this.configService.get('JWT_REFRESH_EXPIRE')) / 1000,
            });
            return refresh_Token;
        };
        this.refreshToken = async (refreshToken, res) => {
            try {
                try {
                    this.jwtService.verify(refreshToken, {
                        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
                    });
                }
                catch (err) {
                    if (err.name === 'TokenExpiredError') {
                        throw new common_1.UnauthorizedException('Refresh Token đã hết hạn. Đăng nhập lại.');
                    }
                    throw new common_1.BadRequestException('Refresh Token không hợp lệ.');
                }
                const userDoc = await this.userService.findUserByRefreshToken(refreshToken);
                if (!userDoc) {
                    throw new common_1.UnauthorizedException('Không tìm thấy người dùng với refresh token.');
                }
                const user = await userDoc.populate({
                    path: 'role',
                    populate: {
                        path: 'permissions',
                    },
                });
                const role = user.role;
                const roleName = role?.name;
                const permission = role?.permissions?.map((per) => per.name);
                const payload = {
                    sub: 'token login',
                    iss: 'from server',
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    branch: user.branch,
                    role: roleName,
                    permission: permission,
                };
                return {
                    access_token: this.jwtService.sign(payload, {
                        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
                        expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
                    }),
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    branch: user.branch,
                    role: roleName,
                    permission: permission,
                };
            }
            catch (error) {
                throw error;
            }
        };
    }
    async validateUser(username, pass) {
        const user = await this.userService
            .findOneByEmail(username)
            .populate({
            path: 'role',
            populate: { path: 'permissions', select: 'module action' },
        })
            .exec();
        if (user) {
            const isValid = await this.userService.isValidPassword(pass, user.password);
            if (isValid === true) {
                return user;
            }
        }
        return null;
    }
    async createAccessToken(payload) {
        return this.jwtService.sign(payload);
    }
    async login(user, res) {
        const { _id, name, email, avatar } = user;
        const userWithRole = await (await this.userService.findOneByID(user._id)).populate({
            path: 'role',
            populate: {
                path: 'permissions',
                select: 'name module action',
            },
        });
        const role = userWithRole.role;
        const roleName = role?.name;
        const payload = {
            sub: 'token login',
            iss: 'from server',
            _id,
            name,
            email,
            avatar,
            branch: user.branch,
            role: roleName,
        };
        const refresh_Token = this.createRefreshToken({ payload });
        await this.userService.updateUserToken(_id, refresh_Token);
        res.clearCookie('refresh_Token');
        res.cookie('refresh_Token', refresh_Token, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: this.configService.get('NODE_ENV') === 'production'
                ? 'none'
                : 'strict',
            maxAge: (0, ms_1.default)(this.configService.get('JWT_REFRESH_EXPIRE')),
        });
        return {
            access_token: this.jwtService.sign(payload),
            _id,
            name,
            email,
            avatar,
            branch: user.branch,
            role: roleName,
        };
    }
    async logout(res, user) {
        await this.userService.updateUserToken(user._id.toString(), null);
        res.clearCookie('refresh_Token');
        return {
            message: 'Đăng xuất thành công',
        };
    }
    async forgotPassword(email) {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('Email không tồn tại trong hệ thống.');
        }
        const token = (0, crypto_1.randomBytes)(3).toString('hex');
        const expiresAt = new Date();
        expiresAt.toLocaleDateString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
        });
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiresAt;
        await user.save();
        await this.mailService.sendResetPasswordEmail(email, token);
    }
    async resetPassword(token, newPassword) {
        const user = await this.userModel.findOne({
            resetPasswordToken: token,
        });
        if (!user) {
            throw new common_1.BadRequestException('Token không hợp lệ.');
        }
        if (user.resetPasswordExpires &&
            user.resetPasswordExpires.getTime() <= Date.now()) {
            await this.userModel.updateOne({ resetPasswordToken: token }, {
                $unset: {
                    resetPasswordToken: 1,
                    resetPasswordExpires: 1,
                },
            });
            throw new common_1.BadRequestException('Token hết hạn.');
        }
        if (newPassword.length < 8) {
            throw new common_1.BadRequestException('Mật khẩu phải có ít nhất 8 ký tự.');
        }
        const hashedPassword = this.userService.hashPassword(newPassword);
        await this.userModel.updateOne({ _id: user._id }, {
            $set: {
                password: hashedPassword,
            },
            $unset: {
                resetPasswordToken: 1,
                resetPasswordExpires: 1,
            },
        });
        await this.userService.updateUserToken(user._id.toString(), null);
        console.log('Mật khẩu đã được cập nhật thành công.');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        config_1.ConfigService,
        mail_service_1.MailService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map