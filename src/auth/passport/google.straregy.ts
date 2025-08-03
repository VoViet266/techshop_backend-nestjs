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
  ): Promise<any> {
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
      let user: any;

      if (existingUser) {
        user = existingUser;
        console.log('User already exists:', user.email);
      } else {
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
    } catch (error) {
      console.error('Error in Google strategy validate:', error);
      throw error;
    }
  }
}
