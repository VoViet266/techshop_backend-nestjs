import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/role/schemas/role.schema';
import { GenderEnum } from 'src/constant/gender.enum';

export type UserDocument = HydratedDocument<User>;
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

  @Prop()
  phone: string;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop()
  age: number;

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
