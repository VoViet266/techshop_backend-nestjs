import mongoose, { HydratedDocument } from 'mongoose';
import { PaymentStatus, RefundStatus } from '../../constant/payment.enum';
export type PaymentDocument = HydratedDocument<Payment>;
export declare class Payment {
    order: string;
    user: string;
    momoOrderId?: string;
    momoRequestId?: string;
    requestId?: string;
    momoTransId: string;
    completedAt: Date;
    status: PaymentStatus;
    refundStatus: RefundStatus;
    payType: string;
    redirectData: Record<string, any>;
    amount: number;
    message: string;
    paymentTime: Date;
    refundTime: Date;
    createdAt: Date;
    updatedAt: Date;
    payUrl?: string;
    deeplink: string;
}
export declare const PaymentSchema: mongoose.Schema<Payment, mongoose.Model<Payment, any, any, any, mongoose.Document<unknown, any, Payment> & Payment & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Payment, mongoose.Document<unknown, {}, mongoose.FlatRecord<Payment>> & mongoose.FlatRecord<Payment> & {
    _id: mongoose.Types.ObjectId;
}>;
