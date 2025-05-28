import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Hoặc SMTP của nhà cung cấp khác
      auth: {
        user: this.configService.get<string>('MAIL_USER'), // Thay bằng email của bạn
        pass: this.configService.get<string>('MAIL_PASSWORD'), // Thay bằng mật khẩu email của bạn
      },
    });
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const resetUrl = `http://localhost:8080/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Yêu cầu đặt lại mật khẩu',
      html: `<head>
    <title>Đặt lại mật khẩu</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            min-height: 100vh;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }


        .logo {
            width: 60px;
            height: 60px;
            background: #ffffff;
            border-radius: 12px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 600;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .content {
            padding: 50px 40px;
            text-align: center;
        }

        .security-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
            border-radius: 50%;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            box-shadow: 0 8px 24px rgba(251, 177, 160, 0.3);
        }

        .greeting {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 20px;
            font-weight: 500;
        }

        .message {
            font-weight: 500;
            font-size: 16px;
            color: #4a5568;
            line-height: 1.6;
            margin-bottom: 35px;
        }

        .reset-button {
            display: inline-block;
            background: #e69410;
            color: #ffffff;
            padding: 16px 40px;
            text-decoration: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(175, 138, 63, 0.4);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(227, 166, 111, 0.6);
        }

        .warning-box {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            border: 1px solid #ffeaa7;
            border-radius: 12px;
            padding: 20px;
            margin: 35px 0;
            position: relative;
        }

        .warning-text {
            color: #856404;
            font-size: 14px;
            font-weight: 500;
            margin: 0;
        }

        .footer {
            background: #f8f9fa;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }

        .footer-text {
            color: #6c757d;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 20px;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
        }

        .social-link {
            width: 40px;
            height: 40px;
            background: #e9ecef;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .social-link:hover {
            background: #667eea;
            color: #ffffff;
            transform: translateY(-2px);
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }

        .footer-link {
            color: #6c757d;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s ease;
        }

        .footer-link:hover {
            color: #667eea;
        }

        .company-info {
            margin-top: 20px;
            color: #adb5bd;
            font-size: 12px;
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 20px;
                border-radius: 12px;
            }

            .content {
                padding: 30px 20px;
            }

            .header {
                padding: 30px 20px;
            }

            .header h1 {
                font-size: 24px;
            }

            .footer {
                padding: 20px;
            }

            .footer-links {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>

<body>
    <div style="padding: 40px 20px; background: #fff0e3; min-height: 100vh;">
        <div class="email-container">
            <div class="content">
                <div class="alignment" align="center" style="line-height:10px">
                    <div class="fullWidth" style="max-width: 374px;"><img
                            src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7631/password_reset.png"
                            style="display: block; height: auto; border: 0; width: 100%;" width="374"
                            alt="Resetting Password" title="Resetting Password" height="auto"></div>
                </div>
                <div class="message">
                    Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
                    Để bảo vệ tài khoản của bạn, vui lòng nhấp vào nút bên dưới để tiếp tục quá trình đặt lại mật khẩu.
                </div>
                <a href="${resetUrl}" class="reset-button">Đặt lại mật khẩu</a>
                <div class="warning-box">
                    <p class="warning-text">
                        <strong style="color: red;">Lưu ý quan trọng:</strong> Liên kết này sẽ hết hạn sau <strong>1
                            phút</strong> kể từ khi
                        bạn nhận được email này vì lý do bảo mật.
                    </p>
                </div>
                <div class="message" style="margin-bottom: 0; font-size: 14px; color: #6c757d;">
                    Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                    Tài khoản của bạn vẫn an toàn và không có thay đổi nào được thực hiện.
                </div>
            </div>
        </div>
    </div>
</body>`,
    });
  }
}
