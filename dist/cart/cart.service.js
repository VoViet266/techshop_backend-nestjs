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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cart_schema_1 = require("./schemas/cart.schema");
const product_schema_1 = require("../product/schemas/product.schema");
const mongoose_2 = require("mongoose");
const variant_schema_1 = require("../product/schemas/variant.schema");
const userDecorator_1 = require("../decorator/userDecorator");
let CartService = class CartService {
    constructor(cartModel, productModel, variantModel) {
        this.cartModel = cartModel;
        this.productModel = productModel;
        this.variantModel = variantModel;
    }
    async create(createCartDto, user) {
        let cart = await this.cartModel.findOne({ user: user._id });
        if (!cart) {
            cart = await this.cartModel.create({
                user: user._id,
                items: [],
                totalQuantity: 0,
                totalPrice: 0,
            });
        }
        for (const newItem of createCartDto.items) {
            const product = await this.productModel.findById(newItem.product).exec();
            if (!product) {
                throw new common_1.NotFoundException(`Sản phẩm với id ${newItem.product} không tồn tại`);
            }
            const variantExists = product.variants.some((v) => v.toString() === newItem.variant);
            if (!variantExists) {
                throw new common_1.NotFoundException(`Biến thể ${newItem.variant} không tồn tại trong sản phẩm ${product._id}`);
            }
            const variant = await this.variantModel.findById(newItem.variant);
            const itemIndex = cart.items.findIndex((item) => item.product.toString() === newItem.product &&
                item.variant.toString() === newItem.variant &&
                item.color === newItem.color);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += newItem.quantity;
                cart.totalPrice =
                    cart.items[itemIndex].quantity * variant.price -
                        (variant.price * product.discount) / 100;
            }
            else {
                cart.items.push({
                    product: new mongoose_2.Types.ObjectId(newItem.product),
                    variant: new mongoose_2.Types.ObjectId(newItem.variant),
                    quantity: newItem.quantity,
                    color: newItem.color,
                    price: variant.price -
                        ((variant.price * product.discount) / 100) * newItem.quantity,
                    branch: new mongoose_2.Types.ObjectId(newItem.branch),
                });
            }
        }
        cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        await cart.save();
        return cart;
    }
    findAll(user) {
        const cart = this.cartModel
            .findOne({ user: user._id })
            .populate({
            path: 'user',
            select: 'email name ',
        })
            .populate({
            path: 'items.product',
            select: 'name slug discount',
        })
            .populate({
            path: 'items.variant',
            select: 'sku imagesMain name price color memory',
        });
        return cart;
    }
    findOne(id) {
        return this.cartModel
            .findOne({ _id: id })
            .populate({
            path: 'user',
            select: 'email name ',
        })
            .populate({
            path: 'items.product',
            select: 'name slug',
        })
            .populate({
            path: 'items.variant',
            select: 'name price color memory',
        });
    }
    update(id, updateCartDto) {
        return this.cartModel.updateOne({
            _id: id,
        }, {
            ...updateCartDto,
        });
    }
    async removeItemFromCart(user, productId, variantId) {
        const cart = await this.cartModel.findOne({ user: user._id });
        if (!cart) {
            throw new common_1.NotFoundException(`Không tìm thấy giỏ hàng của người dùng.`);
        }
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId &&
            item.variant.toString() === variantId);
        if (itemIndex === -1) {
            throw new common_1.NotFoundException(`Không tìm thấy sản phẩm trong giỏ hàng.`);
        }
        cart.items.splice(itemIndex, 1);
        cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);
        await cart.save();
        return cart;
    }
    async remove(user) {
        const cart = await this.cartModel.findOne({ user: user._id });
        if (cart.items.length === 0) {
            throw new common_1.NotFoundException(`Giỏ hàng của người dùng đang rỗng or chưa có giỏ hàng!`);
        }
        return await this.cartModel.updateOne({ user: user._id }, { $set: { items: [] } });
    }
};
exports.CartService = CartService;
__decorate([
    __param(0, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartService.prototype, "remove", null);
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Products.name)),
    __param(2, (0, mongoose_1.InjectModel)(variant_schema_1.Variant.name)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CartService);
//# sourceMappingURL=cart.service.js.map