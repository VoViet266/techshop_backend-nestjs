// auth/strategies/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configSerive: ConfigService,
    private userService: UserService,
  ) {
    super({
      clientID: configSerive.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configSerive.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configSerive.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const email = emails[0].value;
    const existingUser = await this.userService.findOneByEmail(email);

    let user: any;

    if (existingUser) {
      user = existingUser;
    } else {
      // Nếu chưa có thì tạo mới user
      user = await this.userService.create({
        email: email,
        name: name.givenName,
        avatar: photos[0].value,
        password: '',
        phone: '',
        address: [],
        age: 0,
        role: "",
        status: '',
      });
    }

    done(null, user);
  }
}
