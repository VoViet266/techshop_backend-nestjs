import { branchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
export declare class BranchController {
    private readonly branchService;
    constructor(branchService: branchService);
    create(createBranchDto: CreateBranchDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch> & import("./schemas/branch.schema").Branch & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch> & import("./schemas/branch.schema").Branch & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): import("mongoose").Query<Omit<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch> & import("./schemas/branch.schema").Branch & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch> & import("./schemas/branch.schema").Branch & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch> & import("./schemas/branch.schema").Branch & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch> & import("./schemas/branch.schema").Branch & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch> & import("./schemas/branch.schema").Branch & {
        _id: import("mongoose").Types.ObjectId;
    }, "find">;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch> & import("./schemas/branch.schema").Branch & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/branch.schema").Branch> & import("./schemas/branch.schema").Branch & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateBranchDto: UpdateBranchDto): Promise<import("mongoose").UpdateWriteOpResult>;
    remove(id: string): Promise<{
        deleted: number;
    }>;
}
