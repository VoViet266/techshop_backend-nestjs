import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ms from 'ms';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    RoleModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: ms(configService.get<string>('JWT_ACCESS_EXPIRE')) / 1000,
        },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
