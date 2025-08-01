import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/user/interface/user.interface';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    create(createRoleDto: CreateRoleDto, user: IUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/role.schema").Role> & import("./schemas/role.schema").Role & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/role.schema").Role> & import("./schemas/role.schema").Role & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): import("mongoose").Query<Omit<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/role.schema").Role> & import("./schemas/role.schema").Role & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/role.schema").Role> & import("./schemas/role.schema").Role & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/role.schema").Role> & import("./schemas/role.schema").Role & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/role.schema").Role> & import("./schemas/role.schema").Role & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("./schemas/role.schema").Role> & import("./schemas/role.schema").Role & {
        _id: import("mongoose").Types.ObjectId;
    }, "find">;
    findOne(id: string): Promise<Omit<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/role.schema").Role> & import("./schemas/role.schema").Role & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/role.schema").Role> & import("./schemas/role.schema").Role & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<{
        success: boolean;
    }>;
    remove(id: string): import("mongoose").Query<import("mongodb").DeleteResult, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/role.schema").Role> & import("./schemas/role.schema").Role & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/role.schema").Role> & import("./schemas/role.schema").Role & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("./schemas/role.schema").Role> & import("./schemas/role.schema").Role & {
        _id: import("mongoose").Types.ObjectId;
    }, "deleteOne">;
}
