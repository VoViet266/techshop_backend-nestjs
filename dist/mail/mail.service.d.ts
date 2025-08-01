import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendResetPasswordEmail(email: string, token: string): Promise<void>;
    sendOtpEmail(email: string, otp: string): Promise<void>;
}
