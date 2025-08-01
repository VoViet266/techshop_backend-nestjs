import { HydratedDocument } from 'mongoose';
export type BannerDocument = HydratedDocument<Banner>;
export declare class Banner {
    title: string;
    description: string;
    imageUrl: string;
    linkTo: string;
    position: string;
    isActive: boolean;
    clicks: number;
    views: number;
    startDate: Date;
    endDate: Date;
}
export declare const BannerSchemas: import("mongoose").Schema<Banner, import("mongoose").Model<Banner, any, any, any, import("mongoose").Document<unknown, any, Banner> & Banner & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Banner, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Banner>> & import("mongoose").FlatRecord<Banner> & {
    _id: import("mongoose").Types.ObjectId;
}>;
