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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const userDecorator_1 = require("../decorator/userDecorator");
const policies_guard_1 = require("../common/guards/policies.guard");
const policies_decorator_1 = require("../decorator/policies.decorator");
const permission_enum_1 = require("../constant/permission.enum");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    create(createOrderDto, user) {
        return this.orderService.create(createOrderDto, user);
    }
    findAllByStaff(user) {
        return this.orderService.findAllByStaff(user);
    }
    findAllByCustomer(user) {
        return this.orderService.findAllByCustomer(user);
    }
    findOne(id) {
        return this.orderService.findOne(+id);
    }
    update(id, updateOrderDto, user) {
        return this.orderService.update(id, updateOrderDto, user);
    }
    remove(id) {
        return this.orderService.remove(id);
    }
    cancelOrder(id, user) {
        return this.orderService.cancelOrder(id, user);
    }
    requestReturn(id, user, dto) {
        return this.orderService.requestReturn(id, dto);
    }
    confirmReturn(id, user, returnStatus) {
        console.log(returnStatus);
        return this.orderService.confirmReturn(id, returnStatus, user);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Read, permission_enum_1.Subjects.Order)),
    __param(0, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findAllByStaff", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findAllByCustomer", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(policies_guard_1.PoliciesGuard),
    (0, policies_decorator_1.CheckPolicies)((ability) => ability.can(permission_enum_1.Actions.Update, permission_enum_1.Subjects.Order) &&
        ability.can(permission_enum_1.Actions.Read, permission_enum_1.Subjects.Order)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)('/cancel/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, userDecorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Patch)('/request-return/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, userDecorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "requestReturn", null);
__decorate([
    (0, common_1.Patch)('/confirm-return/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, userDecorator_1.User)()),
    __param(2, (0, common_1.Body)('returnStatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "confirmReturn", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('api/v1/orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map