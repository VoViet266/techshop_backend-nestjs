"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const order_schema_1 = require("./schemas/order.schema");
const product_schema_1 = require("../product/schemas/product.schema");
const cart_schema_1 = require("../cart/schemas/cart.schema");
const inventory_service_1 = require("../inventory/inventory.service");
const user_schema_1 = require("../user/schemas/user.schema");
const roles_enum_1 = require("../constant/roles.enum");
const orderStatus_enum_1 = require("../constant/orderStatus.enum");
const payment_enum_1 = require("../constant/payment.enum");
const payment_schema_1 = require("../payment/schemas/payment.schema");
const transaction_enum_1 = require("../constant/transaction.enum");
const cart_service_1 = require("../cart/cart.service");
const promotion_schema_1 = require("../benefit/schemas/promotion.schema");
const warrantypolicy_schema_1 = require("../benefit/schemas/warrantypolicy.schema");
const user_service_1 = require("../user/user.service");
let OrderService = class OrderService {
    constructor(orderModel, productModel, cartModel, paymentModel, promotionModel, warrantyModel, userModel, inventoryService, cartService, userService) {
        this.orderModel = orderModel;
        this.productModel = productModel;
        this.cartModel = cartModel;
        this.paymentModel = paymentModel;
        this.promotionModel = promotionModel;
        this.warrantyModel = warrantyModel;
        this.userModel = userModel;
        this.inventoryService = inventoryService;
        this.cartService = cartService;
        this.userService = userService;
    }
    async create(createOrderDto, user) {
        if (user.role === roles_enum_1.RolesUser.Staff) {
            if (!user.branch) {
                throw new common_1.ForbiddenException('Bạn chưa được gán chi nhánh!');
            }
            const hasBranch = createOrderDto.items.some((item) => item.branch !== user.branch);
            if (hasBranch) {
                throw new common_1.ForbiddenException('Bạn chỉ có quyền tạo đơn tại chi nhánh của mình!');
            }
        }
        let itemsToOrder = [];
        if (!createOrderDto.items || createOrderDto.items.length === 0) {
            const userCart = await this.cartModel.findOne({ user: user._id });
            if (!userCart || userCart.items.length === 0) {
                throw new common_1.HttpException({
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Giỏ hàng của bạn đang trống!',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            itemsToOrder = userCart.items.map((item) => ({
                product: item.product.toString(),
                quantity: item.quantity,
                variant: item.variant.toString(),
                price: item.price,
                branch: item.branch.toString(),
            }));
        }
        else {
            itemsToOrder = createOrderDto.items;
        }
        const findUser = await this.userModel.findById(user._id);
        let phone = findUser?.phone || '';
        createOrderDto.phone = createOrderDto.phone || phone;
        let totalPrice = 0;
        let totalPriceWithPromotion = 0;
        const appliedPromotions = [];
        for (const item of itemsToOrder) {
            totalPrice += item.price * item.quantity;
        }
        const currentDate = new Date();
        const activePromotions = await this.promotionModel
            .find({
            isActive: true,
            $or: [
                { startDate: { $lte: currentDate }, endDate: { $gte: currentDate } },
                { startDate: { $exists: false }, endDate: { $exists: false } },
            ],
        })
            .sort({ value: -1 });
        let finalDiscount = 0;
        for (const promotion of activePromotions) {
            let isEligible = true;
            if (promotion.conditions) {
                if (promotion.conditions.minOrder &&
                    totalPrice < promotion.conditions.minOrder) {
                    isEligible = false;
                }
                if (promotion.conditions.payment &&
                    createOrderDto.paymentMethod.toLocaleLowerCase() !==
                        promotion.conditions.payment.toLocaleLowerCase()) {
                    isEligible = false;
                }
            }
            if (isEligible) {
                let discountAmount = 0;
                if (promotion.valueType === 'fixed') {
                    discountAmount = promotion.value;
                }
                else if (promotion.valueType === 'percent') {
                    discountAmount = (totalPrice * promotion.value) / 100;
                }
                if (discountAmount > finalDiscount) {
                    finalDiscount = discountAmount;
                    appliedPromotions.length = 0;
                    appliedPromotions.push({
                        promotionId: promotion._id,
                        title: promotion.title,
                        valueType: promotion.valueType,
                        value: promotion.value,
                        discountAmount: discountAmount,
                    });
                }
                break;
            }
        }
        totalPriceWithPromotion = Math.max(0, totalPrice - finalDiscount);
        if (!createOrderDto.recipient) {
            throw new common_1.HttpException('Thông tin người nhận không được để trống', common_1.HttpStatus.BAD_REQUEST);
        }
        const newOrder = await this.orderModel.create({
            phone: createOrderDto.phone,
            items: itemsToOrder,
            recipient: createOrderDto.recipient,
            buyer: createOrderDto.buyer || {
                name: findUser?.name,
                phone: findUser?.phone || '',
            },
            totalPrice: totalPriceWithPromotion,
            discountAmount: finalDiscount,
            appliedPromotions: appliedPromotions,
            user: user._id,
            paymentMethod: createOrderDto.paymentMethod,
            status: orderStatus_enum_1.OrderStatus.PENDING,
            paymentStatus: payment_enum_1.PaymentStatus.PENDING,
            createdBy: {
                name: user.name,
                email: user.email,
            },
            source: createOrderDto.items && createOrderDto.items.length > 0
                ? payment_enum_1.OrderSource.POS
                : payment_enum_1.OrderSource.ONLINE,
        });
        const newPayment = await this.paymentModel.create({
            order: newOrder._id,
            user: user._id,
            amount: totalPriceWithPromotion,
            payType: createOrderDto.paymentMethod,
            status: payment_enum_1.PaymentStatus.PENDING,
            paymentTime: createOrderDto.paymentStatus === payment_enum_1.PaymentStatus.COMPLETED
                ? new Date()
                : undefined,
        });
        newOrder.payment = newPayment._id;
        await newOrder.save();
        if (createOrderDto.items || createOrderDto.items.length === 0) {
            await this.cartService.remove(user);
        }
        return newOrder;
    }
    findAllByCustomer(user) {
        return this.orderModel
            .find({ user: user._id })
            .populate({
            path: 'items.product',
            select: 'name ',
        })
            .populate({
            path: 'items.variant',
            select: 'name ',
        })
            .populate({
            path: 'items.branch',
            select: 'name',
        })
            .sort({ createdAt: -1 });
    }
    findAllByStaff(user) {
        switch (user.role) {
            case roles_enum_1.RolesUser.Admin:
                return this.orderModel
                    .find()
                    .populate({ path: 'items.branch', select: 'name ' })
                    .populate({ path: 'items.product', select: 'name ' })
                    .populate({ path: 'items.variant', select: 'name ' })
                    .sort({ createdAt: -1 });
            case roles_enum_1.RolesUser.Staff:
                return this.orderModel
                    .find({ branch: user.branch })
                    .populate({ path: 'items.branch', select: 'name ' })
                    .populate({ path: 'items.product', select: 'name ' })
                    .populate({ path: 'items.variant', select: 'name ' })
                    .sort({ createdAt: -1 });
            default:
                throw new common_1.ForbiddenException('Bạn không có quyền truy cập!');
        }
    }
    findOne(id) {
        return this.orderModel
            .findById(id)
            .populate('items.product')
            .populate('items.variant');
    }
    async update(id, updateOrderDto, user) {
        const orderExist = await this.orderModel.findById(id);
        if (!orderExist) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: 'Đơn hàng không tồn tại',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        orderExist.status = updateOrderDto.status;
        orderExist.paymentStatus = updateOrderDto.paymentStatus;
        orderExist.save();
        const userInfor = await this.userService.findOne(user._id.toString());
        const userEmail = userInfor.email;
        const userName = userInfor.name;
        if ((updateOrderDto.status = orderStatus_enum_1.OrderStatus.DELIVERED)) {
            for (const item of orderExist.items) {
                await this.productModel.updateOne({ _id: item.product }, { $inc: { sold: item.quantity } });
                await this.inventoryService.exportStock({
                    branchId: item.branch.toString(),
                    productId: item.product.toString(),
                    source: transaction_enum_1.TransactionSource.ORDER,
                    variants: [
                        {
                            variantId: item.variant.toString(),
                            quantity: item.quantity,
                        },
                    ],
                }, {
                    email: userEmail,
                    name: userName,
                });
            }
        }
        return 'Update order successfully';
    }
    async remove(id) {
        return this.orderModel.findByIdAndDelete(id).then((result) => {
            if (!result) {
                throw new common_1.HttpException({
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Đơn hàng không tồn tại',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return { message: 'Đơn hàng đã được xóa thành công' };
        });
    }
    async cancelOrder(id, user) {
        const order = await this.orderModel.findById(id);
        if (!order) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: 'Đơn hàng không tồn tại',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        if (order.user.toString() !== user._id.toString()) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: 'Bạn không có quyền hủy đơn hàng này',
            }, common_1.HttpStatus.FORBIDDEN);
        }
        if (order.paymentStatus === payment_enum_1.PaymentStatus.COMPLETED ||
            order.paymentStatus === payment_enum_1.PaymentStatus.CANCELLED ||
            order.paymentStatus === payment_enum_1.PaymentStatus.REFUNDED) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Không thể hủy đơn hàng!!!!',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        await this.orderModel.findByIdAndUpdate(id, {
            status: orderStatus_enum_1.OrderStatus.CANCELLED,
            paymentStatus: payment_enum_1.PaymentStatus.CANCELLED,
        });
        const payment = await this.paymentModel.findById(order.payment);
        await this.paymentModel.findByIdAndUpdate(payment._id, {
            status: payment_enum_1.PaymentStatus.CANCELLED,
        });
        return { message: 'Đơn hàng đã được hủy thành công' };
    }
    async requestReturn(orderId, dto) {
        console.log(dto);
        const order = await this.orderModel.findById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        if (order.isReturned) {
            throw new common_1.BadRequestException('Đơn hàng đã có yêu cầu trả hàng trước đó');
        }
        order.isReturned = true;
        order.returnReason = dto.returnReason;
        order.returnStatus = 'requested';
        await order.save();
        return { message: 'Yêu cầu trả hàng đã được gửi', order };
    }
    async confirmReturn(orderId, returnStatus, user) {
        const order = await this.orderModel.findById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
        if (!order.isReturned) {
            throw new common_1.BadRequestException('Đơn hàng này chưa có yêu cầu trả hàng');
        }
        order.returnStatus = returnStatus;
        if (returnStatus === 'approved') {
            order.paymentStatus = payment_enum_1.PaymentStatus.REFUNDED;
            order.status = orderStatus_enum_1.OrderStatus.RETURNED;
        }
        if (returnStatus === 'rejected') {
            order.isReturned = false;
        }
        order.returnProcessedBy = {
            name: user.name,
            email: user.email,
        };
        if (returnStatus === 'completed') {
            if (order.payment) {
                const payment = await this.paymentModel.findById(order.payment);
                if (payment) {
                    payment.status = payment_enum_1.PaymentStatus.REFUNDED;
                    await payment.save();
                }
            }
            for (const item of order.items) {
                await this.inventoryService.importStock({
                    branchId: item.branch.toString(),
                    productId: item.product?.toString(),
                    variants: [
                        {
                            variantId: item.variant?.toString(),
                            quantity: item.quantity,
                        },
                    ],
                    source: transaction_enum_1.TransactionSource.RETURN,
                }, user);
            }
        }
        await order.save();
        return { message: `Đã ${returnStatus} yêu cầu trả hàng`, order };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Products.name)),
    __param(2, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(3, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(4, (0, mongoose_1.InjectModel)(promotion_schema_1.Promotion.name)),
    __param(5, (0, mongoose_1.InjectModel)(warrantypolicy_schema_1.WarrantyPolicy.name)),
    __param(6, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, inventory_service_1.InventoryService,
        cart_service_1.CartService,
        user_service_1.UserService])
], OrderService);
//# sourceMappingURL=order.service.js.map