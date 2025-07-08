import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type BranchDocument = HydratedDocument<Branch>;

@Schema({
  timestamps: true,
})
export class Branch {
  @Prop({
    required: true,
    unique: true,
    index: true,
    trim: true,
  })
  name: string;

  @Prop({
    // required: true,
    trim: true,
  })
  address: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  manager: mongoose.Schema.Types.ObjectId;

  @Prop()
  location: string;

  @Prop({
    trim: true,
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

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);

// Indexes for better performance
BranchSchema.index({ name: 1, isActive: 1 });
BranchSchema.index({ isDeleted: 1, isActive: 1 });
