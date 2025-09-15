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
import { OrderService } from 'src/order/order.service';
import { ConfigService } from '@nestjs/config';

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
    private configService: ConfigService,
    private readonly orderService: OrderService,
  ) {}

  async createPayment(dto: CreatePaymentDto, user: IUser) {
    try {
      if (!dto.amount || dto.amount <= 0) {
        throw new Error('Invalid amount');
      }

      if (!dto.order) {
        throw new Error('Order ID is required');
      }

      const existingOrder = await this.orderModel.findById(dto.order);
      if (!existingOrder) throw new Error('Order not found');

      let existingPayment = await this.paymentModel.findOne({
        user: user._id,
        order: dto.order,
      });

      // CASE 1: Nếu chưa có payment record, tạo mới
      if (!existingPayment) {
        // Tạo payment record mới trước khi gọi MoMo
        existingPayment = await this.paymentModel.create({
          user: user._id,
          order: dto.order,
          amount: dto.amount,
          method: PaymentMethod.MOMO,
          status: PaymentStatus.PENDING,
        });
      }

      if (existingPayment.status === PaymentStatus.COMPLETED) {
        return {
          resultCode: 9001,
          message: 'Đơn hàng đã thanh toán trước đó',
        };
      }

      if (existingPayment.payUrl && existingPayment.deeplink) {
        const now = new Date();
        const diffMinutes =
          (now.getTime() - new Date(existingPayment.updatedAt).getTime()) /
          (1000 * 60);

        if (diffMinutes < 15) {
          return {
            resultCode: 9000,
            message: 'Payment đã được tạo trước đó',
            payUrl: existingPayment.payUrl,
            deeplink: existingPayment.deeplink,
          };
        }
      }

      // Tạo request mới đến MoMo
      const orderInfo = `Thanh toán đơn hàng ${user._id} với đơn giá ${dto.amount} VNĐ`;
      const requestId = `${this.partnerCode}${Date.now()}`;
      const orderId = `${dto.order}-${Date.now()}`;
      const redirectUrl = `${this.configService.get<string>("BASE_URL")}/api/v1/payment/momo/callback`;
      const ipnUrl =
        'https://your-ngrok.ngrok-free.app/api/v1/payment/momo/notify';
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
        amount: dto.amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: 'vi',
      };

      const response = await axios.post(this.endpoint, body, {
        headers: { 'Content-Type': 'application/json' },
      });

      const momoResponse = response.data;

      if (momoResponse.resultCode === 0) {
        // Bây giờ chắc chắn existingPayment tồn tại
        await this.paymentModel.findByIdAndUpdate(existingPayment._id, {
          momoOrderId: orderId,
          requestId,
          payUrl: momoResponse.payUrl,
          deeplink: momoResponse.deeplink,
          updatedAt: new Date(),
        });

        return momoResponse;
      } else {
        const errorMessages = {
          1000: 'Giao dịch thất bại',
          1001: 'Giao dịch bị từ chối',
          1002: 'Giao dịch bị hủy',
          1003: 'Giao dịch hết hạn',
          1004: 'Số dư không đủ',
          1005: 'Giao dịch không hợp lệ',
          1006: 'Người dùng hủy giao dịch',
          2001: 'Giao dịch thất bại do lỗi hệ thống',
          7000: 'Người dùng chưa đăng ký dịch vụ MoMo',
          7002: 'Mã OTP không chính xác',
          9998: 'Giao dịch đang được xử lý',
          9999: 'Giao dịch thất bại không xác định',
        };

        const errorMessage =
          errorMessages[momoResponse.resultCode] ||
          'Lỗi không xác định từ MoMo';

        throw new Error(errorMessage);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Không thể kết nối đến MoMo. Vui lòng thử lại sau.');
      }

      if (error.code === 'ENOTFOUND') {
        throw new Error('Lỗi DNS. Không thể tìm thấy máy chủ MoMo.');
      }

      if (error.code === 'ETIMEDOUT') {
        throw new Error('Timeout khi kết nối MoMo. Vui lòng thử lại.');
      }

      if (error.response?.status === 500) {
        throw new Error('Lỗi hệ thống MoMo. Vui lòng thử lại sau.');
      }

      if (error.response?.status === 400) {
        throw new Error('Dữ liệu gửi đến MoMo không hợp lệ.');
      }

      // Database errors
      if (error.name === 'MongoError' || error.name === 'MongooseError') {
        throw new Error('Lỗi cơ sở dữ liệu. Vui lòng thử lại.');
      }

      // Re-throw custom errors
      if (
        error.message.includes('Invalid amount') ||
        error.message.includes('Order ID is required') ||
        error.message.includes('Order not found') ||
        error.message.includes('Order already paid')
      ) {
        throw error;
      }

      // Generic error
      throw new Error(
        `Lỗi thanh toán MoMo: ${error.response?.data?.message || error.message || 'Lỗi không xác định'}`,
      );
    }
  }
  async handleMoMoRedirect(query: any) {
    try {
      const payment = await this.paymentModel.findOne({
        momoOrderId: query.orderId,
        requestId: query.requestId,
      });

      if (!payment) {
        console.error('Payment not found:', {
          momoOrderId: query.orderId,
          requestId: query.requestId,
        });

        // Thử tìm bằng orderId pattern (loại bỏ timestamp)
        const baseOrderId = query.orderId.split('-')[0];
        const fallbackPayment = await this.paymentModel.findOne({
          order: baseOrderId,
          user: payment.user,
        });

        if (!fallbackPayment) {
          throw new Error('Không tìm thấy giao dịch tương ứng');
        }

        // Update payment với thông tin MoMo
        await this.paymentModel.findByIdAndUpdate(fallbackPayment._id, {
          momoOrderId: query.orderId,
          requestId: query.requestId,
        });

        // Sử dụng fallbackPayment cho logic tiếp theo
        return this.processPaymentResult(fallbackPayment, query);
      }

      // 3. Check if already completed
      if (payment.status === PaymentStatus.COMPLETED) {
        return {
          success: true,
          message: 'Giao dịch đã hoàn tất trước đó',
        };
      }

      // 4. Process payment result
      return this.processPaymentResult(payment, query);
    } catch (error) {
      console.error('Redirect Error:', error);
      return {
        success: false,
        message: error.message || 'Lỗi không xác định khi xử lý redirect',
      };
    }
  }

  // Helper method để xử lý kết quả thanh toán
  private async processPaymentResult(payment: any, query: any) {
    try {
      if (query.resultCode === '0') {
        // Payment successful
        await this.paymentModel.findByIdAndUpdate(payment._id, {
          status: PaymentStatus.COMPLETED,
          completedAt: new Date(),
          momoTransId: query.transId,
          redirectData: query,
        });

        // Update order status
        const order = await this.orderModel.findById(payment.order);

        await this.orderService.update(
          payment.order,
          { paymentStatus: PaymentStatus.COMPLETED },
          order.user,
        );

        return {
          success: true,
          message: 'Thanh toán thành công',
          paymentId: payment._id,
          orderId: payment.order,
        };
      } else {
        // Payment failed
        await this.paymentModel.findByIdAndUpdate(payment._id, {
          status: PaymentStatus.FAILED,
          failedAt: new Date(),
          failureReason: query.message || 'Thanh toán thất bại',
          redirectData: query,
        });

        return {
          success: false,
          message: `Thanh toán thất bại: ${query.message || 'Lỗi không xác định'}`,
          resultCode: query.resultCode,
        };
      }
    } catch (error) {
      console.error('Process payment result error:', error);
      throw new Error('Lỗi khi xử lý kết quả thanh toán');
    }
  }

  // async handleMoMoIPN(ipnData: any, user: IUser) {
  //   try {
  //     const { signature, ...dataToVerify } = ipnData;
  //     const rawSignature = Object.keys(dataToVerify)
  //       .sort()
  //       .map((key) => `${key}=${dataToVerify[key]}`)
  //       .join('&');

  //     const expectedSignature = crypto
  //       .createHmac('sha256', this.secretKey)
  //       .update(rawSignature)
  //       .digest('hex');

  //     if (signature !== expectedSignature) {
  //       throw new Error('Invalid signature');
  //     }

  //     // 2. Process payment result
  //     const payment = await this.paymentModel.findOne({
  //       momoOrderId: ipnData.orderId,
  //       requestId: ipnData.requestId,
  //     });

  //     if (!payment) {
  //       throw new Error('Payment not found');
  //     }

  //     if (payment.status === PaymentStatus.COMPLETED) {
  //       return { resultCode: 0, message: 'Already processed' };
  //     }

  //     // 3. Update payment status based on result
  //     if (ipnData.resultCode === 0) {
  //       // Payment successful
  //       await this.paymentModel.findOneAndUpdate(
  //         { _id: payment._id },
  //         {
  //           status: PaymentStatus.COMPLETED,
  //           completedAt: new Date(),
  //           momoTransId: ipnData.transId,
  //           ipnData: ipnData,
  //         },
  //       );

  //       // Update order status
  //       await this.orderService.update(
  //         payment.order,
  //         { paymentStatus: PaymentStatus.COMPLETED },
  //         user,
  //       );

  //       return { resultCode: 0, message: 'Payment completed successfully' };
  //     } else {
  //       // Payment failed
  //       await this.paymentModel.findOneAndUpdate(
  //         { _id: payment._id },
  //         {
  //           status: PaymentStatus.FAILED,
  //           failedAt: new Date(),
  //           failureReason: ipnData.message || 'Payment failed',
  //           ipnData: ipnData,
  //         },
  //       );

  //       return { resultCode: 0, message: 'Payment failed processed' };
  //     }
  //   } catch (error) {
  //     console.error('MoMo IPN Error:', error);
  //     throw error;
  //   }
  // }
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
