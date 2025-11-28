import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import aqp from 'api-query-params';
import { CreateReplyDto } from 'src/product/dto/create-comment.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { ProductService } from 'src/product/product.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: SoftDeleteModel<ReviewDocument>,
    private readonly productService: ProductService,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const comment = await this.reviewModel.create({
      ...createReviewDto,
    });

    // Cập nhật averageRating cho product
    const stats = await this.getProductRatingStats(createReviewDto.productId);
    await this.productService.updateRating(
      createReviewDto.productId,
      stats.averageRating,
      stats.totalComments,
    );

    return comment;
  }
  async findByProduct(
    productId: string,
    currentPage: number,
    limit: number,
    qs: string,
  ) {
    const { filter, sort = {}, population } = aqp(qs);

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
  async getProductRatingStats(productId: string) {
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
  async addReply(commentId: string, createReplyDto: CreateReplyDto) {
    const comment = await this.reviewModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Không tìm thấy comment');
    }

    const reply = {
      userId: new Types.ObjectId(createReplyDto.userId),
      userName: createReplyDto.userName,
      content: createReplyDto.content,
      createdAt: new Date(),
    };

    comment.replies.push(reply);
    await comment.save();

    return reply;
  }
}
