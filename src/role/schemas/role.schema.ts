import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;
@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop()
  description: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  permissions: string[];
  @Prop({ default: false })
  isDeleted: boolean;
  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
