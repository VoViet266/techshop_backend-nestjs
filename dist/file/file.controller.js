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
exports.FileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const config_1 = require("@nestjs/config");
const messageDecorator_1 = require("../decorator/messageDecorator");
const publicDecorator_1 = require("../decorator/publicDecorator");
let FileController = class FileController {
    constructor(configService) {
        this.configService = configService;
        this.Base_URL = this.configService.get('BASE_URL');
        this.PORT = this.configService.get('PORT');
    }
    uploadFile(file, request) {
        const filePath = `${this.Base_URL}${this.PORT}/uploads/${file.filename}`;
        return {
            filePath: file.path,
            filename: file.filename,
        };
    }
};
exports.FileController = FileController;
__decorate([
    (0, common_1.Post)(''),
    (0, publicDecorator_1.Public)(),
    (0, messageDecorator_1.ResponseMessage)('Upload file thành công'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "uploadFile", null);
exports.FileController = FileController = __decorate([
    (0, common_1.Controller)('api/v1/upload'),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileController);
//# sourceMappingURL=file.controller.js.map