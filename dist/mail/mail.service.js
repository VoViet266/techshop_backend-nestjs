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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASSWORD'),
            },
        });
    }
    async sendResetPasswordEmail(email, token) {
        const resetCode = token;
        await this.transporter.sendMail({
            from: this.configService.get('EMAIL_FROM'),
            to: email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            html: `<head>
  <!DOCTYPE html>
<html lang="vi">
<head>
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

        .code-container {
            background: #f3dfce;
            border-radius: 16px;
            padding: 30px;
            margin: 35px 0;
            position: relative;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }

        .code-label {
            color: #0e0e0eff;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.9;
        }

        .verification-code {
            background: #ffffff;
            color: #2d3748;
            font-size: 32px;
            font-weight: 700;
            padding: 20px 30px;
            border-radius: 12px;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            border: 2px solid #e2e8f0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: inline-block;
            margin: 0 auto;
            user-select: all;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .verification-code:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .copy-hint {
            color: #ffffff;
            font-size: 12px;
            margin-top: 15px;
            opacity: 0.8;
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

            .verification-code {
                font-size: 24px;
                letter-spacing: 4px;
                padding: 15px 20px;
            }

            .code-container {
                padding: 20px;
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
                    Để bảo vệ tài khoản của bạn, vui lòng sử dụng mã khôi phục bên dưới.
                </div>

                <div class="code-container">
                    <div class="code-label">Mã khôi phục mật khẩu</div>
                    <div class="verification-code" onclick="this.select();">${resetCode}</div>
                    <div class="copy-hint">Nhấp vào mã để sao chép</div>
                </div>

                <div class="warning-box">
                    <p class="warning-text">
                        <strong style="color: red;">Lưu ý quan trọng:</strong> Mã khôi phục này sẽ hết hạn sau <strong>5 phút</strong> kể từ khi
                        bạn nhận được email này vì lý do bảo mật. Vui lòng sử dụng mã ngay lập tức.
                    </p>
                </div>

                <div class="message" style="margin-bottom: 0; font-size: 14px; color: #6c757d;">
                    Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                    Tài khoản của bạn vẫn an toàn và không có thay đổi nào được thực hiện.
                </div>
            </div>
        </div>
    </div>
</body>
</html>`,
        });
    }
    async sendOtpEmail(email, otp) {
        await this.transporter.sendMail({
            from: this.configService.get('MAIL_USER'),
            to: email,
            subject: 'Mã xác thực tài khoản',
            html: `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mã xác thực</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 5px;">
        <h2 style="color: #333; text-align: center; margin-bottom: 30px;">
          Mã xác thực tài khoản
        </h2>
        
        <p style="color: #666; margin-bottom: 20px;">
          Xin chào,
        </p>
        
        <p style="color: #666; margin-bottom: 20px;">
          Bạn đã yêu cầu mã xác thực cho tài khoản của mình. Vui lòng sử dụng mã sau:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="background-color: #f8f9fa; padding: 15px 25px; font-size: 24px; font-weight: bold; color: #333; border: 2px solid #ddd; border-radius: 5px; letter-spacing: 3px;">
            ${otp}
          </span>
        </div>
        
        <p style="color: #666; margin-bottom: 20px;">
          Mã này có hiệu lực trong <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.
        </p>
        
        <p style="color: #666; margin-bottom: 20px;">
          Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
          Đây là email tự động, vui lòng không phản hồi lại email này.
        </p>
      </div>
    </body>
    </html>
    `,
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map