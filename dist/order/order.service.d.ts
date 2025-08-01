import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { ProductDocument } from 'src/product/schemas/product.schema';
import { CartDocument } from 'src/cart/schemas/cart.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/user/interface/user.interface';
import { InventoryService } from 'src/inventory/inventory.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import { PaymentDocument } from 'src/payment/schemas/payment.schema';
import mongoose, { Types } from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { PromotionDocument } from 'src/benefit/schemas/promotion.schema';
import { WarrantyPolicyDocument } from 'src/benefit/schemas/warrantypolicy.schema';
import { UserService } from 'src/user/user.service';
export declare class OrderService {
    private readonly orderModel;
    private readonly productModel;
    private readonly cartModel;
    private readonly paymentModel;
    private readonly promotionModel;
    private readonly warrantyModel;
    private readonly userModel;
    private readonly inventoryService;
    private readonly cartService;
    private readonly userService;
    constructor(orderModel: SoftDeleteModel<OrderDocument>, productModel: SoftDeleteModel<ProductDocument>, cartModel: SoftDeleteModel<CartDocument>, paymentModel: SoftDeleteModel<PaymentDocument>, promotionModel: SoftDeleteModel<PromotionDocument>, warrantyModel: SoftDeleteModel<WarrantyPolicyDocument>, userModel: SoftDeleteModel<UserDocument>, inventoryService: InventoryService, cartService: CartService, userService: UserService);
    create(createOrderDto: CreateOrderDto, user: IUser): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    findAllByCustomer(user: IUser): mongoose.Query<Omit<Omit<Omit<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, never>, never>, never>[], mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, {}, mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }, "find">;
    findAllByStaff(user: IUser): mongoose.Query<Omit<Omit<Omit<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, never>, never>, never>[], mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, {}, mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }, "find">;
    findOne(id: number): mongoose.Query<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, {}, mongoose.Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }, "findOne">;
    update(id: string, updateOrderDto: UpdateOrderDto, user: any): Promise<string>;
    remove(id: string): Promise<{
        message: string;
    }>;
    cancelOrder(id: string, user: IUser): Promise<{
        message: string;
    }>;
    requestReturn(orderId: string, dto: {
        returnReason: string;
    }): Promise<{
        message: string;
        order: mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Order> & Order & {
            _id: Types.ObjectId;
        }> & mongoose.Document<unknown, {}, Order> & Order & {
            _id: Types.ObjectId;
        } & Required<{
            _id: Types.ObjectId;
        }>;
    }>;
    confirmReturn(orderId: string, returnStatus: string, user: IUser): Promise<{
        message: string;
        order: mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Order> & Order & {
            _id: Types.ObjectId;
        }> & mongoose.Document<unknown, {}, Order> & Order & {
            _id: Types.ObjectId;
        } & Required<{
            _id: Types.ObjectId;
        }>;
    }>;
}
