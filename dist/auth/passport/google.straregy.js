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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = require("@nestjs/config");
const user_service_1 = require("../../user/user.service");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(configSerive, userService) {
        super({
            clientID: configSerive.get('GOOGLE_CLIENT_ID'),
            clientSecret: configSerive.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: 'http://localhost:8080/api/v1/auth/google/callback',
            scope: ['email', 'profile'],
        });
        this.configSerive = configSerive;
        this.userService = userService;
    }
    async validate(accessToken, refreshToken, profile) {
        try {
            const { name, emails, photos } = profile;
            if (!emails || emails.length === 0) {
                throw new Error('No email provided by Google');
            }
            const email = emails[0].value;
            if (!email) {
                throw new Error('Invalid email from Google');
            }
            const existingUser = await this.userService.findOneByEmail(email);
            let user;
            if (existingUser) {
                user = existingUser;
                console.log('User already exists:', user.email);
            }
            else {
                console.log('User does not exist, creating new user:', email);
                user = await this.userService.create({
                    email,
                    name: `${name.givenName} ${name.familyName}`,
                    avatar: photos?.[0]?.value || '',
                    password: '',
                    phone: '',
                    address: [],
                    age: 0,
                    refreshToken: '',
                    branch: '',
                });
            }
            return user;
        }
        catch (error) {
            console.error('Error in Google strategy validate:', error);
            throw error;
        }
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        user_service_1.UserService])
], GoogleStrategy);
//# sourceMappingURL=google.straregy.js.map