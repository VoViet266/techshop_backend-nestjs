import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IUser } from 'src/user/interface/user.interface';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(createOrderDto: CreateOrderDto, user: IUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAllByStaff(user: IUser): import("mongoose").Query<Omit<Omit<Omit<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>, never>, never>[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    }, "find">;
    findAllByCustomer(user: IUser): import("mongoose").Query<Omit<Omit<Omit<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>, never>, never>[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    }, "find">;
    findOne(id: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    }, "findOne">;
    update(id: string, updateOrderDto: UpdateOrderDto, user: IUser): Promise<string>;
    remove(id: string): Promise<{
        message: string;
    }>;
    cancelOrder(id: string, user: IUser): Promise<{
        message: string;
    }>;
    requestReturn(id: string, user: IUser, dto: {
        returnReason: string;
    }): Promise<{
        message: string;
        order: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
            _id: import("mongoose").Types.ObjectId;
        }> & import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
            _id: import("mongoose").Types.ObjectId;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    confirmReturn(id: string, user: IUser, returnStatus: string): Promise<{
        message: string;
        order: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
            _id: import("mongoose").Types.ObjectId;
        }> & import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
            _id: import("mongoose").Types.ObjectId;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
}
