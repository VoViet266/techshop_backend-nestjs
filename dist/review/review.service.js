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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("./schemas/review.schema");
const api_query_params_1 = __importDefault(require("api-query-params"));
let ReviewService = class ReviewService {
    constructor(reviewModel) {
        this.reviewModel = reviewModel;
    }
    async create(createReviewDto) {
        const comment = await this.reviewModel.create({
            ...createReviewDto,
        });
        return comment;
    }
    async findByProduct(productId, currentPage, limit, qs) {
        const { filter, sort = {}, population } = (0, api_query_params_1.default)(qs);
        delete filter.page;
        delete filter.limit;
        filter.isDeleted = false;
        filter.productId = productId;
        const page = Number(currentPage) || 1;
        const pageSize = Number(limit) || 10;
        const skip = (page - 1) * pageSize;
        const [comments, total] = await Promise.all([
            this.reviewModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .populate('userId', 'name email avatar')
                .populate('replies.userId', 'name email avatar')
                .exec(),
            this.reviewModel.countDocuments(filter),
        ]);
        return {
            comments,
            meta: {
                currentPage: page,
                totalPages: Math.ceil(total / pageSize),
                totalItems: total,
                pageSize,
            },
        };
    }
    async getProductRatingStats(productId) {
        const stats = await this.reviewModel.aggregate([
            {
                $match: {
                    productId,
                },
            },
            {
                $group: {
                    _id: null,
                    totalComments: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    ratings: { $push: '$rating' },
                },
            },
        ]);
        if (stats.length === 0) {
            return {
                totalComments: 0,
                averageRating: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            };
        }
        return stats[0];
    }
    async addReply(commentId, createReplyDto) {
        const comment = await this.reviewModel.findById(commentId);
        if (!comment) {
            throw new common_1.NotFoundException('Không tìm thấy comment');
        }
        const reply = {
            userId: new mongoose_2.Types.ObjectId(createReplyDto.userId),
            userName: createReplyDto.userName,
            content: createReplyDto.content,
            createdAt: new Date(),
        };
        comment.replies.push(reply);
        await comment.save();
        return reply;
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [Object])
], ReviewService);
//# sourceMappingURL=review.service.js.map