import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getHello(): string {
    const test = this.configService.get<string>('JWT_ACCESS_EXPIRE');
    console.log('test', test);
    return 'Hello World!';
  }
}
