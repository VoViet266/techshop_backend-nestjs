import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/user/interface/user.interface';
import { OrderDocument } from 'src/order/schemas/order.schema';
import { OrderService } from 'src/order/order.service';
export declare class PaymentService {
    private readonly paymentModel;
    private readonly orderModel;
    private readonly orderService;
    private readonly partnerCode;
    private readonly accessKey;
    private readonly secretKey;
    private readonly endpoint;
    constructor(paymentModel: SoftDeleteModel<PaymentDocument>, orderModel: SoftDeleteModel<OrderDocument>, orderService: OrderService);
    createPayment(dto: CreatePaymentDto, user: IUser): Promise<any>;
    handleMoMoRedirect(query: any): Promise<{
        success: boolean;
        message: string;
        paymentId: any;
        orderId: any;
        resultCode?: undefined;
    } | {
        success: boolean;
        message: string;
        resultCode: any;
        paymentId?: undefined;
        orderId?: undefined;
    } | {
        success: boolean;
        message: any;
    }>;
    private processPaymentResult;
    create(createPaymentDto: CreatePaymentDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Payment> & Payment & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Payment> & Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<Omit<Omit<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Payment> & Payment & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Payment> & Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>, never>[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Payment> & Payment & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Payment> & Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Payment> & Payment & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, Payment> & Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<{
        deleted: number;
    }>;
}
