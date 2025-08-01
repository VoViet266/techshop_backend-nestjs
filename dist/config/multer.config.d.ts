import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
export declare class MulterConfigService implements MulterOptionsFactory {
    getRootPath: () => string;
    ensureExistsSync(targetDirectory: string): void;
    createMulterOptions(): MulterModuleOptions;
}
