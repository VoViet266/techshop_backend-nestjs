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
exports.BannerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const banner_schema_1 = require("./schemas/banner.schema");
let BannerService = class BannerService {
    constructor(bannerModel) {
        this.bannerModel = bannerModel;
    }
    create(createBannerDto) {
        return this.bannerModel.create(createBannerDto);
    }
    findAll() {
        return this.bannerModel.find().sort({ createdAt: -1 }).exec();
    }
    findOne(id) {
        return this.bannerModel.findById(id).exec();
    }
    update(id, updateBannerDto) {
        return this.bannerModel
            .updateOne({ _id: id }, { $set: updateBannerDto })
            .exec();
    }
    remove(id) {
        return this.bannerModel.deleteOne({ _id: id });
    }
};
exports.BannerService = BannerService;
exports.BannerService = BannerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(banner_schema_1.Banner.name)),
    __metadata("design:paramtypes", [Object])
], BannerService);
//# sourceMappingURL=banner.service.js.map