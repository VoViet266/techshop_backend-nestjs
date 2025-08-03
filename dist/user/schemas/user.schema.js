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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("@nestjs/mongoose");
const role_schema_1 = require("../../role/schemas/role.schema");
const gender_enum_1 = require("../../constant/gender.enum");
const branch_schema_1 = require("../../branch/schemas/branch.schema");
const AddressSchema = new mongoose_1.default.Schema({
    specificAddress: { type: String },
    addressDetail: { type: String },
    default: { type: Boolean, default: false },
}, {
    _id: false,
    strict: true,
});
let User = class User {
};
exports.User = User;
__decorate([
    (0, mongoose_2.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: mongoose_1.default.Schema.Types.ObjectId, ref: role_schema_1.Role.name }),
    __metadata("design:type", mongoose_1.default.Schema.Types.ObjectId)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_2.Prop)(),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_2.Prop)({
        trim: true,
    }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_2.Prop)({ enum: gender_enum_1.GenderEnum }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: [AddressSchema], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "addresses", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: mongoose_1.default.Schema.Types.ObjectId, ref: branch_schema_1.Branch.name }),
    __metadata("design:type", mongoose_1.default.Schema.Types.ObjectId)
], User.prototype, "branch", void 0);
__decorate([
    (0, mongoose_2.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    (0, mongoose_2.Prop)(),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_2.Prop)(),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, mongoose_2.Prop)(),
    __metadata("design:type", String)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, mongoose_2.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "resetPasswordExpires", void 0);
__decorate([
    (0, mongoose_2.Prop)({}),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_2.Prop)({}),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, mongoose_2.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_2.SchemaFactory.createForClass(User);
exports.UserSchema.index({ email: 1 }, { unique: true });
//# sourceMappingURL=user.schema.js.map