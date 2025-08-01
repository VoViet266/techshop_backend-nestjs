import { ReviewService } from './review.service';
import { CreateReplyDto, CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    create(createReviewDto: CreateReviewDto): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/review.schema").Review> & import("./schemas/review.schema").Review & {
            _id: import("mongoose").Types.ObjectId;
        }> & import("mongoose").Document<unknown, {}, import("./schemas/review.schema").Review> & import("./schemas/review.schema").Review & {
            _id: import("mongoose").Types.ObjectId;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    findByProduct(productId: string, currentPage: string, limit: string, qs: string): Promise<{
        data: {
            comments: Omit<Omit<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/review.schema").Review> & import("./schemas/review.schema").Review & {
                _id: import("mongoose").Types.ObjectId;
            }> & import("mongoose").Document<unknown, {}, import("./schemas/review.schema").Review> & import("./schemas/review.schema").Review & {
                _id: import("mongoose").Types.ObjectId;
            } & Required<{
                _id: import("mongoose").Types.ObjectId;
            }>, never>, never>[];
            meta: {
                currentPage: number;
                totalPages: number;
                totalItems: number;
                pageSize: number;
            };
        };
    }>;
    addReply(commentId: string, createReplyDto: CreateReplyDto): Promise<{
        success: boolean;
        message: string;
        data: {
            userId: import("mongoose").Types.ObjectId;
            userName: string;
            content: string;
            createdAt: Date;
        };
    }>;
}
