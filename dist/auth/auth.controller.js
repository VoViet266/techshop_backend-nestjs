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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const messageDecorator_1 = require("../decorator/messageDecorator");
const userDecorator_1 = require("../decorator/userDecorator");
const publicDecorator_1 = require("../decorator/publicDecorator");
const local_guard_1 = require("../common/guards/local.guard");
const create_user_dto_1 = require("../user/dto/create-user.dto");
const user_service_1 = require("../user/user.service");
const passport_1 = require("@nestjs/passport");
const ms_1 = __importDefault(require("ms"));
const config_1 = require("@nestjs/config");
const verify_otp_dto_1 = require("../user/dto/verify-otp.dto");
let AuthController = class AuthController {
    constructor(authService, userService, configService) {
        this.authService = authService;
        this.userService = userService;
        this.configService = configService;
    }
    handleLogin(req, res) {
        return this.authService.login(req.user, res);
    }
    async register(register) {
        return this.userService.register(register);
    }
    async googleAuth() { }
    async googleAuthRedirect(req, res) {
        const user = req.user;
        const userWithRole = await (await this.userService.findOneByID(user._id)).populate({
            path: 'role',
            populate: {
                path: 'permissions',
                select: 'name module action',
            },
        });
        const role = userWithRole.role;
        const roleName = role?.name;
        const permission = role?.permissions?.map((per) => ({
            name: per.name,
            module: per.module,
            action: per.action,
        }));
        const payload = {
            sub: 'token login',
            iss: 'from server',
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            branch: user?.branch,
            role: roleName,
            permission: permission,
        };
        const access_token = await this.authService.createAccessToken(payload);
        const refresh_Token = this.authService.createRefreshToken({ payload });
        await this.userService.updateUserToken(user._id, refresh_Token);
        res.cookie('refresh_Token', refresh_Token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: this.configService.get('NODE_ENV') === 'production'
                ? 'none'
                : 'lax',
            maxAge: (0, ms_1.default)(this.configService.get('JWT_REFRESH_EXPIRE')),
        });
        res.redirect(`http://localhost:5173/oauth-success?access_token=${access_token}`);
        return {
            message: 'Đăng nhập thành công!',
        };
    }
    handleGetAccount(user) {
        const userInformation = this.userService.findOneByID(user._id).populate({
            path: 'role',
            populate: {
                path: 'permissions',
                select: 'name module action',
            },
        });
        return userInformation;
    }
    handleRefreshToken(request, res) {
        const refreshToken = request.cookies['refresh_Token'];
        return this.authService.refreshToken(refreshToken, res);
    }
    handleLogout(res, user) {
        return this.authService.logout(res, user);
    }
    async forgotPassword(email) {
        if (!email) {
            throw new common_1.BadRequestException('Email là trường bắt buộc.');
        }
        await this.authService.forgotPassword(email);
        return `Yêu cầu đặt lại mật khẩu đã được gửi đến email ${email}. Vui lòng kiểm tra hộp thư đến của bạn.`;
    }
    async resetPassword(token, password) {
        if (!token || !password) {
            throw new common_1.BadRequestException('Token và mật khẩu mới là các trường bắt buộc.');
        }
        if (password.length < 8) {
            throw new common_1.BadRequestException('Mật khẩu phải có ít nhất 8 ký tự.');
        }
        await this.authService.resetPassword(token, password);
        return {
            message: 'Mật khẩu đã được đặt lại thành công.',
        };
    }
    async resendOtp(email) {
        console.log(email);
        return await this.userService.resendOtp(email);
    }
    async verifyOtp(verifyOtpDto) {
        return await this.userService.verifyOtp(verifyOtpDto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(local_guard_1.LocalAuthGuard),
    (0, messageDecorator_1.ResponseMessage)('Đăng nhập thành công'),
    (0, publicDecorator_1.Public)(),
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleLogin", null);
__decorate([
    (0, publicDecorator_1.Public)(),
    (0, common_1.Post)('/register'),
    (0, messageDecorator_1.ResponseMessage)('Đăng ký thành công'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, publicDecorator_1.Public)(),
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, messageDecorator_1.ResponseMessage)('Lấy thông tin tài khoản thành công'),
    (0, common_1.Get)('/account'),
    __param(0, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleGetAccount", null);
__decorate([
    (0, messageDecorator_1.ResponseMessage)('Lấy Refresh Token thành công'),
    (0, common_1.Get)('/refresh'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleRefreshToken", null);
__decorate([
    (0, messageDecorator_1.ResponseMessage)('Đăng xuất thành công'),
    (0, common_1.Get)('/logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleLogout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, messageDecorator_1.ResponseMessage)('Yêu cầu đặt lại mật khẩu'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, messageDecorator_1.ResponseMessage)('Mật khẩu đã được đặt lại thành công.'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Body)('token')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOtp", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, publicDecorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/v1/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map