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
        variants: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Variant.name,
        },
      },
    ],
  })
  items: {
    productId: mongoose.Schema.Types.ObjectId;
    variants: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];

  @Prop({ enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: string;

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
