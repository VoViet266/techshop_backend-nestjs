import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
export declare class BannerService {
    private readonly bannerModel;
    constructor(bannerModel: SoftDeleteModel<BannerDocument>);
    create(createBannerDto: CreateBannerDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Banner> & Banner & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Banner> & Banner & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Banner> & Banner & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Banner> & Banner & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: number): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Banner> & Banner & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Banner> & Banner & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateBannerDto: UpdateBannerDto): Promise<import("mongoose").UpdateWriteOpResult>;
    remove(id: string): import("mongoose").Query<import("mongodb").DeleteResult, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Banner> & Banner & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Banner> & Banner & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, Banner> & Banner & {
        _id: import("mongoose").Types.ObjectId;
    }, "deleteOne">;
}
