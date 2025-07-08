import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/user/interface/user.interface';
import { PaymentMethod, PaymentStatus } from 'src/constant/payment.enum';
import { Order, OrderDocument } from 'src/order/schemas/order.schema';

@Injectable()
export class PaymentService {
  private readonly partnerCode = 'MOMO';
  private readonly accessKey = 'F8BBA842ECF85';
  private readonly secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  private readonly endpoint =
    'https://test-payment.momo.vn/v2/gateway/api/create';

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: SoftDeleteModel<PaymentDocument>,

    @InjectModel(Order.name)
    private readonly orderModel: SoftDeleteModel<OrderDocument>,
  ) {}

  async createPayment(dto: CreatePaymentDto, user: IUser) {
    const orderInfo = `Thanh toán gói thành viên ${user._id} với đơn hàng giá  ${dto.amount} VNĐ`;
    const requestId = `${this.partnerCode}${Date.now()}`;
    const orderId = `ORDER_${Date.now()}`;
    // redirectUrl là nơi người dùng sẽ được chuyển hướng sau khi thanh toán thành công ở Frontend
    const redirectUrl = 'https://momo.vn/return';
    const ipnUrl =
      ' https://96eb-2001-ee0-533b-f3a0-30cb-cf3e-f6e1-2deb.ngrok-free.app/api/v1/payment/momo/notify';
    const extraData = Buffer.from(
      JSON.stringify({ userId: user._id }),
    ).toString('base64');
    const requestType = 'captureWallet';

    const rawSignature = `accessKey=${this.accessKey}&amount=${dto.amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const body = {
      partnerCode: this.partnerCode,
      accessKey: this.accessKey,
      requestId,
      amount: dto.amount.toString(),
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: 'vi',
    };

    try {
      const response = await axios.post(this.endpoint, body, {
        headers: { 'Content-Type': 'application/json' },
      });

      await this.paymentModel.create({
        order: dto.order,
        user: user._id,
        momoOrderId: orderId,
        requestId,
        amount: dto.amount,
        status: PaymentStatus.PENDING,
        payType: PaymentMethod.MOMO,
        orderInfo,
        extraData,
        createdAt: new Date(),
      });

      return response.data; // chứa payUrl, deeplink, etc.
    } catch (error) {
      throw new Error(
        `MoMo error: ${error.response?.data?.message || error.response?.data || error.message}`,
      );
    }
  }
  async updatePaymentStatus({
    orderId,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    status,
  }: any) {
    await this.paymentModel.findOneAndUpdate(
      { momoOrderId: orderId },
      {
        status,
        momoTransId: transId,
        message,
        resultCode,
        paymentTime: responseTime,
        payType,
      },
    );

    // Nếu bạn có bảng đơn hàng
    if (status === PaymentStatus.COMPLETED) {
      await this.orderModel.findOneAndUpdate(
        { momoOrderId: orderId },
        { status: PaymentStatus.COMPLETED },
      );
    }
  }
  create(createPaymentDto: CreatePaymentDto) {
    return this.paymentModel.create(createPaymentDto);
  }

  async findAll() {
    return this.paymentModel.find().populate('user').populate('order');
  }

  async findOne(id: string) {
    return this.paymentModel.findById(id).exec();
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentModel
      .findByIdAndUpdate(id, updatePaymentDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.paymentModel.softDelete({ _id: id });
  }
}
