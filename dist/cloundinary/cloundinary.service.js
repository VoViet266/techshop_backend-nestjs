"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloundinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
let CloundinaryService = class CloundinaryService {
    async uploadImage(file) {
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
                folder: 'uploads',
                resource_type: 'image',
                access_mode: 'public',
                access_control: [],
                format: 'webp',
                transformation: [{ format: 'webp' }],
            }, (error, result) => {
                if (error) {
                    console.error('Lỗi khi upload:', error);
                    return reject(error);
                }
                if (result.bytes > 5 * 1024 * 1024) {
                    return reject(new Error('Dung lượng ảnh vượt quá giới hạn cho phép (5MB)'));
                }
                return resolve(result);
            });
        });
    }
    async getImage(url) {
        const publicId = url.split('/').slice(-2).join('/').split('.')[0];
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.api.resource(publicId, (error, result) => {
                if (error) {
                    console.error('Lỗi khi lấy ảnh:', error);
                    return reject(error);
                }
                return resolve(result);
            });
        });
    }
    async deleteImage(url) {
        console.log('Xóa ảnh:', url);
        const publicId = url.split('/').slice(-2).join('/').split('.')[0];
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    return reject(new common_1.NotFoundException('Không tìm thấy ảnh hoặc lỗi khi xóa'));
                }
                if (!result || !result.result) {
                    return reject(new Error('Không có kết quả trả về từ Cloudinary'));
                }
                if (result.result === 'ok') {
                    console.log('Xóa ảnh thành công:', url);
                    return resolve('Xóa ảnh thành công');
                }
                else {
                    return reject(new common_1.NotFoundException('Không thể xóa ảnh'));
                }
            });
        });
    }
};
exports.CloundinaryService = CloundinaryService;
exports.CloundinaryService = CloundinaryService = __decorate([
    (0, common_1.Injectable)()
], CloundinaryService);
//# sourceMappingURL=cloundinary.service.js.map