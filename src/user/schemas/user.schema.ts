import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  avatar?: string;

  @Prop({})
  phone: string;

  @Prop({})
  gender: string;

  @Prop({})
  address: string;

  @Prop({})
  age: Date;

  @Prop({})
  createdAt: Date;
  
  @Prop({})
  updatedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
