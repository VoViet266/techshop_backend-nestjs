import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import fs from 'fs';
import { diskStorage } from 'multer';
import path, { join } from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  getRootPath = () => {
    return process.cwd();
  };
  ensureExistsSync(targetDirectory: string) {
    try {
      fs.mkdirSync(targetDirectory, { recursive: true });
      console.log('Directory successfully created, or it already exists.');
    } catch (error) {
      console.error('Error creating directory:', error);
    }
  }
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(this.getRootPath(), 'public/uploads');
          this.ensureExistsSync(uploadPath); // dùng hàm sync
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          //get image extension
          let extName = path.extname(file.originalname);
          //get image's name (without extension)
          let baseName = path
            .basename(file.originalname, extName)
            .replace(/\s+/g, '_');
          let finalName = `${baseName}-${Date.now()}${extName}`;
          cb(null, finalName);
        },
      }),
    };
  }
}
