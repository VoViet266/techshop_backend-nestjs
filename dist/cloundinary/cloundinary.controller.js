"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloundinaryController = void 0;
const common_1 = require("@nestjs/common");
const cloundinary_service_1 = require("./cloundinary.service");
const platform_express_1 = require("@nestjs/platform-express");
const publicDecorator_1 = require("../decorator/publicDecorator");
const swagger_1 = require("@nestjs/swagger");
const policies_guard_1 = require("../common/guards/policies.guard");
const permission_enum_1 = require("../constant/permission.enum");
const policies_decorator_1 = require("../decorator/policies.decorator");
let CloundinaryController = class CloundinaryController {
    constructor(cloundinaryService) {
        this.cloundinaryService = cloundinaryService;
    }
    uploadImage(file) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('File size exceeds the limit of 5MB');
        }
        if (!file.mimetype.startsWith('image/')) {
            throw new Error('Invalid file type. Only images are allowed.');
        }
        console.log('Uploading file to Cloudinary:', file.originalname);
        return this.cloundinaryService.uploadImage(file);
    }
    getAllImages(publicId) {
        return this.cloundinaryService.getImage(publicId);
    }
    async deleteFile(url) {
        return await this.cloundinaryService.deleteImage(url);
    }
};
exports.CloundinaryController = CloundinaryController;
__decorate([
    (0, common_1.Post)('image'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Create, permission_enum_1.Subjects.Cloudinary)),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CloundinaryController.prototype, "uploadImage", null);
__decorate([
    (0, publicDecorator_1.Public)(),
    (0, common_1.Get)('image'),
    __param(0, (0, common_1.Query)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CloundinaryController.prototype, "getAllImages", null);
__decorate([
    (0, common_1.Delete)('image'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Delete, permission_enum_1.Subjects.Cloudinary)),
    __param(0, (0, common_1.Query)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CloundinaryController.prototype, "deleteFile", null);
exports.CloundinaryController = CloundinaryController = __decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('api/v1/upload'),
    __metadata("design:paramtypes", [cloundinary_service_1.CloundinaryService])
], CloundinaryController);
//# sourceMappingURL=cloundinary.controller.js.map