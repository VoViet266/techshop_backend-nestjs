import { CreateReviewDto } from './dto/create-review.dto';
import { Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReplyDto } from 'src/product/dto/create-comment.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
export declare class ReviewService {
    private readonly reviewModel;
    constructor(reviewModel: SoftDeleteModel<ReviewDocument>);
    create(createReviewDto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Review> & Review & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Review> & Review & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    findByProduct(productId: string, currentPage: number, limit: number, qs: string): Promise<{
        comments: Omit<Omit<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Review> & Review & {
            _id: Types.ObjectId;
        }> & import("mongoose").Document<unknown, {}, Review> & Review & {
            _id: Types.ObjectId;
        } & Required<{
            _id: Types.ObjectId;
        }>, never>, never>[];
        meta: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            pageSize: number;
        };
    }>;
    getProductRatingStats(productId: string): Promise<any>;
    addReply(commentId: string, createReplyDto: CreateReplyDto): Promise<{
        userId: Types.ObjectId;
        userName: string;
        content: string;
        createdAt: Date;
    }>;
}
