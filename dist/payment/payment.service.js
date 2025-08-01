"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
const mongoose_1 = require("@nestjs/mongoose");
const payment_schema_1 = require("./schemas/payment.schema");
const payment_enum_1 = require("../constant/payment.enum");
const order_schema_1 = require("../order/schemas/order.schema");
const order_service_1 = require("../order/order.service");
let PaymentService = class PaymentService {
    constructor(paymentModel, orderModel, orderService) {
        this.paymentModel = paymentModel;
        this.orderModel = orderModel;
        this.orderService = orderService;
        this.partnerCode = 'MOMO';
        this.accessKey = 'F8BBA842ECF85';
        this.secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        this.endpoint = 'https://test-payment.momo.vn/v2/gateway/api/create';
    }
    async createPayment(dto, user) {
        try {
            if (!dto.amount || dto.amount <= 0) {
                throw new Error('Invalid amount');
            }
            if (!dto.order) {
                throw new Error('Order ID is required');
            }
            const existingOrder = await this.orderModel.findById(dto.order);
            if (!existingOrder)
                throw new Error('Order not found');
            let existingPayment = await this.paymentModel.findOne({
                user: user._id,
                order: dto.order,
            });
            if (!existingPayment) {
                existingPayment = await this.paymentModel.create({
                    user: user._id,
                    order: dto.order,
                    amount: dto.amount,
                    method: payment_enum_1.PaymentMethod.MOMO,
                    status: payment_enum_1.PaymentStatus.PENDING,
                });
            }
            if (existingPayment.status === payment_enum_1.PaymentStatus.COMPLETED) {
                return {
                    resultCode: 9001,
                    message: 'Đơn hàng đã thanh toán trước đó',
                };
            }
            if (existingPayment.payUrl && existingPayment.deeplink) {
                const now = new Date();
                const diffMinutes = (now.getTime() - new Date(existingPayment.updatedAt).getTime()) /
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
            const orderInfo = `Thanh toán đơn hàng ${user._id} với đơn giá ${dto.amount} VNĐ`;
            const requestId = `${this.partnerCode}${Date.now()}`;
            const orderId = `${dto.order}-${Date.now()}`;
            const redirectUrl = 'http://localhost:8080/api/v1/payment/momo/callback';
            const ipnUrl = 'https://your-ngrok.ngrok-free.app/api/v1/payment/momo/notify';
            const extraData = Buffer.from(JSON.stringify({ userId: user._id })).toString('base64');
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
            const response = await axios_1.default.post(this.endpoint, body, {
                headers: { 'Content-Type': 'application/json' },
            });
            const momoResponse = response.data;
            if (momoResponse.resultCode === 0) {
                await this.paymentModel.findByIdAndUpdate(existingPayment._id, {
                    momoOrderId: orderId,
                    requestId,
                    payUrl: momoResponse.payUrl,
                    deeplink: momoResponse.deeplink,
                    updatedAt: new Date(),
                });
                return momoResponse;
            }
            else {
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
                const errorMessage = errorMessages[momoResponse.resultCode] ||
                    'Lỗi không xác định từ MoMo';
                throw new Error(errorMessage);
            }
        }
        catch (error) {
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
            if (error.name === 'MongoError' || error.name === 'MongooseError') {
                throw new Error('Lỗi cơ sở dữ liệu. Vui lòng thử lại.');
            }
            if (error.message.includes('Invalid amount') ||
                error.message.includes('Order ID is required') ||
                error.message.includes('Order not found') ||
                error.message.includes('Order already paid')) {
                throw error;
            }
            throw new Error(`Lỗi thanh toán MoMo: ${error.response?.data?.message || error.message || 'Lỗi không xác định'}`);
        }
    }
    async handleMoMoRedirect(query) {
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
                const baseOrderId = query.orderId.split('-')[0];
                const fallbackPayment = await this.paymentModel.findOne({
                    order: baseOrderId,
                    user: payment.user,
                });
                if (!fallbackPayment) {
                    throw new Error('Không tìm thấy giao dịch tương ứng');
                }
                await this.paymentModel.findByIdAndUpdate(fallbackPayment._id, {
                    momoOrderId: query.orderId,
                    requestId: query.requestId,
                });
                return this.processPaymentResult(fallbackPayment, query);
            }
            if (payment.status === payment_enum_1.PaymentStatus.COMPLETED) {
                return {
                    success: true,
                    message: 'Giao dịch đã hoàn tất trước đó',
                };
            }
            return this.processPaymentResult(payment, query);
        }
        catch (error) {
            console.error('Redirect Error:', error);
            return {
                success: false,
                message: error.message || 'Lỗi không xác định khi xử lý redirect',
            };
        }
    }
    async processPaymentResult(payment, query) {
        try {
            if (query.resultCode === '0') {
                await this.paymentModel.findByIdAndUpdate(payment._id, {
                    status: payment_enum_1.PaymentStatus.COMPLETED,
                    completedAt: new Date(),
                    momoTransId: query.transId,
                    redirectData: query,
                });
                const order = await this.orderModel.findById(payment.order);
                await this.orderService.update(payment.order, { paymentStatus: payment_enum_1.PaymentStatus.COMPLETED }, order.user);
                return {
                    success: true,
                    message: 'Thanh toán thành công',
                    paymentId: payment._id,
                    orderId: payment.order,
                };
            }
            else {
                await this.paymentModel.findByIdAndUpdate(payment._id, {
                    status: payment_enum_1.PaymentStatus.FAILED,
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
        }
        catch (error) {
            console.error('Process payment result error:', error);
            throw new Error('Lỗi khi xử lý kết quả thanh toán');
        }
    }
    create(createPaymentDto) {
        return this.paymentModel.create(createPaymentDto);
    }
    async findAll() {
        return this.paymentModel.find().populate('user').populate('order');
    }
    async findOne(id) {
        return this.paymentModel.findById(id).exec();
    }
    async update(id, updatePaymentDto) {
        return this.paymentModel
            .findByIdAndUpdate(id, updatePaymentDto, { new: true })
            .exec();
    }
    async remove(id) {
        return this.paymentModel.softDelete({ _id: id });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [Object, Object, order_service_1.OrderService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map