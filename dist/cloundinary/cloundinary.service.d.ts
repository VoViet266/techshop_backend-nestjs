export declare class CloundinaryService {
    uploadImage(file: Express.Multer.File): Promise<any>;
    getImage(url: string): Promise<string>;
    deleteImage(url: string): Promise<string>;
}
