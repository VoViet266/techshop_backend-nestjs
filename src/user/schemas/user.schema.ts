import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/role/schemas/role.schema';
import { GenderEnum } from 'src/constant/gender.enum';
import { Branch } from 'src/branch/schemas/branch.schema';

export type UserDocument = HydratedDocument<User>;
const AddressSchema = new mongoose.Schema(
  {
    specificAddress: { type: String },
    addressDetail: { type: String },
    default: { type: Boolean, default: false },
  },
  {
    _id: false,
    strict: true,
  },
);
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
  role: Role;

  @Prop()
  avatar?: string;  

  @Prop({
    trim: true,
  })
  phone: string;

  @Prop({ enum: GenderEnum })
  gender: string;

  @Prop({ type: [AddressSchema], default: [] })
  addresses: {
    specificAddress: string;
    addressDetail: string;
    default: boolean;
  }[];

  // @Prop({
  //   enum: ['GUEST', 'NEW', 'MEMBER', 'VIP'],
  //   default: 'GUEST',
  // })
  // userType: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Branch.name })
  branch?: mongoose.Schema.Types.ObjectId;

  @Prop()
  age?: number;

  @Prop()
  isActive: boolean;

  @Prop()
  refreshToken: string;

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
