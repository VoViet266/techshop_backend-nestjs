import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class FileController {
    private readonly configService;
    private readonly Base_URL;
    private readonly PORT;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, request: Request): {
        filePath: string;
        filename: string;
    };
}
