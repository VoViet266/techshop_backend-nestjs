import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
export declare class BrandService {
    private brandModel;
    constructor(brandModel: SoftDeleteModel<BrandDocument>);
    create(createBrandDto: CreateBrandDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Brand> & Brand & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Brand> & Brand & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): import("mongoose").Query<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Brand> & Brand & {
        _id: import("mongoose").Types.ObjectId;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Brand> & Brand & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Brand> & Brand & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, Brand> & Brand & {
        _id: import("mongoose").Types.ObjectId;
    }, "find">;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Brand> & Brand & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Brand> & Brand & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<import("mongoose").UpdateWriteOpResult>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
