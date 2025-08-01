import { CloundinaryService } from './cloundinary.service';
export declare class CloundinaryController {
    private readonly cloundinaryService;
    constructor(cloundinaryService: CloundinaryService);
    uploadImage(file: Express.Multer.File): Promise<any>;
    getAllImages(publicId: string): Promise<string>;
    deleteFile(url: string): Promise<string>;
}
