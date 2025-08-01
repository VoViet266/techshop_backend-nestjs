import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
export declare class PermissionController {
    private readonly permissionService;
    constructor(permissionService: PermissionService);
    create(createPermissionDto: CreatePermissionDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    }, "find">;
    findOne(id: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    }, "findOne">;
    update(id: string, updatePermissionDto: UpdatePermissionDto): import("mongoose").Query<import("mongoose").UpdateWriteOpResult, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    }, "updateOne">;
    remove(id: string): import("mongoose").Query<import("mongodb").DeleteResult, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("./schemas/permission.schema").Permission> & import("./schemas/permission.schema").Permission & {
        _id: import("mongoose").Types.ObjectId;
    }, "deleteOne">;
}
