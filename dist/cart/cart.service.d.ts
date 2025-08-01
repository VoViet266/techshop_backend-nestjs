import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart, CartDocument } from './schemas/cart.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProductDocument } from 'src/product/schemas/product.schema';
import { IUser } from 'src/user/interface/user.interface';
import { Types } from 'mongoose';
import { VariantDocument } from 'src/product/schemas/variant.schema';
export declare class CartService {
    private readonly cartModel;
    private readonly productModel;
    private readonly variantModel;
    constructor(cartModel: SoftDeleteModel<CartDocument>, productModel: SoftDeleteModel<ProductDocument>, variantModel: SoftDeleteModel<VariantDocument>);
    create(createCartDto: CreateCartDto, user: IUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    findAll(user: IUser): import("mongoose").Query<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    }, "findOne">;
    findOne(id: number): import("mongoose").Query<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    }, "findOne">;
    update(id: string, updateCartDto: UpdateCartDto): import("mongoose").Query<import("mongoose").UpdateWriteOpResult, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    }, "updateOne">;
    removeItemFromCart(user: IUser, productId: string, variantId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Cart> & Cart & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    remove(user: IUser): Promise<import("mongoose").UpdateWriteOpResult>;
}
