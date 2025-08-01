import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Branch } from 'src/branch/schemas/branch.schema';
import { TransactionStatus } from 'src/constant/transaction.enum';
import { Products } from 'src/product/schemas/product.schema';
import { Variant } from 'src/product/schemas/variant.schema';
import { User } from 'src/user/schemas/user.schema';

export type TransferDocument = HydratedDocument<Transfer>;
@Schema({ timestamps: true })
export class Transfer {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Branch.name,
    required: true,
  })
  fromBranchId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Branch.name,
    required: true,
  })
  toBranchId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Products.name,
        },
        quantity: { type: Number, required: true },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Variant.name,
        },
        unit: { type: String },
      },
    ],
  })
  items: {
    productId: mongoose.Schema.Types.ObjectId;
    variantId: mongoose.Schema.Types.ObjectId;
    quantity: number;
    unit?: string;
  }[];

  @Prop({ enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  approvedBy?: Types.ObjectId[];

  @Prop()
  approvedAt?: Date;

  @Prop()
  rejectNote?: string;

  @Prop() note: string;

  @Prop({
    type: {
      email: String,
      name: String,
    },
  })
  createdBy: {
    email: string;
    name: string;
  };

  @Prop({
    type: {
      email: String,
      name: String,
    },
  })
  updatedBy: {
    email: string;
    name: string;
  };
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
