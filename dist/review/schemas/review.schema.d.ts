import { HydratedDocument, Types } from 'mongoose';
export declare class Reply {
    userId: Types.ObjectId;
    userName: string;
    content: string;
    createdAt: Date;
}
export declare const ReplySchema: import("mongoose").Schema<Reply, import("mongoose").Model<Reply, any, any, any, import("mongoose").Document<unknown, any, Reply> & Reply & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reply, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Reply>> & import("mongoose").FlatRecord<Reply> & {
    _id: Types.ObjectId;
}>;
export type ReviewDocument = HydratedDocument<Review>;
export declare class Review {
    userId: Types.ObjectId;
    userName: string;
    content: string;
    productId: string;
    rating: number;
    replies: Reply[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const ReviewSchema: import("mongoose").Schema<Review, import("mongoose").Model<Review, any, any, any, import("mongoose").Document<unknown, any, Review> & Review & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Review>> & import("mongoose").FlatRecord<Review> & {
    _id: Types.ObjectId;
}>;
