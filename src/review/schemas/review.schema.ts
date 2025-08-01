import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Reply {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true, maxlength: 1000 })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}
export const ReplySchema = SchemaFactory.createForClass(Reply);

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true, maxlength: 3000 })
  content: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ min: 1, max: 5, default: 5 })
  rating: number;

  @Prop({ default: 0 })
  likes?: number;

  @Prop({ default: 0 })
  dislikes?: number;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likedBy?: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  dislikedBy?: Types.ObjectId[];

  @Prop({ type: [ReplySchema], default: [] })
  replies: Reply[];

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
