import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/role/schemas/role.schema';
import { GenderEnum } from 'src/constant/gender.enum';

export type UserDocument = HydratedDocument<User>;
const AddressSchema = new mongoose.Schema(
  {
    addressDetail: { type: String, required: true },
    default: { type: Boolean, default: false },
  },
  {
    _id: false,
    strict: true, // Cấm field lạ như isDeleted, deletedAt nếu không khai báo
  },
);
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Role.name }],
    ref: Role.name,
  })
  role: mongoose.Schema.Types.ObjectId[];

  @Prop()
  avatar?: string;

  @Prop({
    trim: true,
    validate: {
      validator: function (v: string) {
        return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Invalid phone number format',
    },
  })
  phone: string;

  @Prop({ enum: GenderEnum })
  gender: string;

  @Prop({ type: [AddressSchema], default: [] })
  address: {
    addressDetail: string;
    default: boolean;
  }[];

  @Prop({
    enum: ['GUEST', 'NEW', 'MEMBER', 'VIP'],
    default: 'GUEST',
  })
  userType: string;

  @Prop()
  age: number;


  @Prop()
  totalSpent: string;

  @Prop()
  totalOrders: number;

  @Prop()
  refeshToken: string;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;

  @Prop({})
  createdAt: Date;

  @Prop({})
  updatedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
