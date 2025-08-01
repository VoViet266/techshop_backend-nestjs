import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { IUser } from 'src/user/interface/user.interface';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    create(createCartDto: CreateCartDto, user: IUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").Cart> & import("./schemas/cart.schema").Cart & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").Cart> & import("./schemas/cart.schema").Cart & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(user: IUser): import("mongoose").Query<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").Cart> & import("./schemas/cart.schema").Cart & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").Cart> & import("./schemas/cart.schema").Cart & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").Cart> & import("./schemas/cart.schema").Cart & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").Cart> & import("./schemas/cart.schema").Cart & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").Cart> & import("./schemas/cart.schema").Cart & {
        _id: import("mongoose").Types.ObjectId;
    }, "findOne">;
    update(id: string, updateCartDto: UpdateCartDto): import("mongoose").Query<import("mongoose").UpdateWriteOpResult, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").Cart> & import("./schemas/cart.schema").Cart & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").Cart> & import("./schemas/cart.schema").Cart & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").Cart> & import("./schemas/cart.schema").Cart & {
        _id: import("mongoose").Types.ObjectId;
    }, "updateOne">;
    remove(user: IUser): Promise<import("mongoose").UpdateWriteOpResult>;
    removeItem(user: IUser, productId: string, variantId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").Cart> & import("./schemas/cart.schema").Cart & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").Cart> & import("./schemas/cart.schema").Cart & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
