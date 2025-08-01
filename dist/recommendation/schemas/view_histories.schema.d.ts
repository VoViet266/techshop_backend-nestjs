import { HydratedDocument } from 'mongoose';
export type ViewHistoryDocument = HydratedDocument<ViewHistory>;
export declare class ViewHistory {
    userId: string;
    productId: string;
    viewedAt: Date;
}
export declare const ViewHistorySchema: import("mongoose").Schema<ViewHistory, import("mongoose").Model<ViewHistory, any, any, any, import("mongoose").Document<unknown, any, ViewHistory> & ViewHistory & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ViewHistory, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ViewHistory>> & import("mongoose").FlatRecord<ViewHistory> & {
    _id: import("mongoose").Types.ObjectId;
}>;
