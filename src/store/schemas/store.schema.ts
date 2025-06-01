import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StoreDocument = HydratedDocument<Store>;

@Schema({
  timestamps: true,
})
export class Store {
  @Prop({
    required: true,
    unique: true,
    index: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  address: string;

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

  @Prop({
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v: string) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format',
    },
  })
  email: string;
  

  @Prop({
    default: true,
    index: true,
  })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const StoreSchema = SchemaFactory.createForClass(Store);

// Indexes for better performance
StoreSchema.index({ name: 1, isActive: 1 });
StoreSchema.index({ isDeleted: 1, isActive: 1 });
