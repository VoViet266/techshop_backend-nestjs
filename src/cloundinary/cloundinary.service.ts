import { Injectable, NotFoundException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
@Injectable()
export class CloundinaryService {
  async uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          folder: 'uploads',
          resource_type: 'image',
          access_mode: 'public',
          // allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
          access_control: [],
          format: 'webp', // Chỉ định định dạng ảnh
          transformation: [{ format: 'webp' }],
        },
        (error, result) => {
          if (error) {
            console.error('Lỗi khi upload:', error);
            return reject(error);
          }
          if (result.bytes > 5 * 1024 * 1024) {
            // Giới hạn dung lượng ảnh (5MB)
            return reject(
              new Error('Dung lượng ảnh vượt quá giới hạn cho phép (5MB)'),
            );
          }
          return resolve(result);
        },
      );
    });
  }

  async getImage(url: string): Promise<string> {
    const publicId = url.split('/').slice(-2).join('/').split('.')[0];
    return new Promise((resolve, reject) => {
      cloudinary.api.resource(publicId, (error, result) => {
        if (error) {
          console.error('Lỗi khi lấy ảnh:', error);
          return reject(error);
        }
        return resolve(result);
      });
    });
  }

  async deleteImage(url: string): Promise<string> {
    console.log('Xóa ảnh:', url);
    const publicId = url.split('/').slice(-2).join('/').split('.')[0];
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(
            new NotFoundException('Không tìm thấy ảnh hoặc lỗi khi xóa'),
          );
        }

        if (!result || !result.result) {
          return reject(new Error('Không có kết quả trả về từ Cloudinary'));
        }
        if (result.result === 'ok') {
          console.log('Xóa ảnh thành công:', url);
          return resolve('Xóa ảnh thành công');
        } else {
          return reject(new NotFoundException('Không thể xóa ảnh'));
        }
      });
    });
  }
}
