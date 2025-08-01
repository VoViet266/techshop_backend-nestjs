import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Branch, BranchDocument } from './schemas/branch.schema';
export declare class branchService {
    private readonly branchModel;
    constructor(branchModel: SoftDeleteModel<BranchDocument>);
    create(createBranchDto: CreateBranchDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Branch> & Branch & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Branch> & Branch & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): import("mongoose").Query<Omit<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Branch> & Branch & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Branch> & Branch & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Branch> & Branch & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Branch> & Branch & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, Branch> & Branch & {
        _id: import("mongoose").Types.ObjectId;
    }, "find">;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Branch> & Branch & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Branch> & Branch & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateBranchDto: UpdateBranchDto): Promise<import("mongoose").UpdateWriteOpResult>;
    remove(id: string): Promise<{
        deleted: number;
    }>;
}
