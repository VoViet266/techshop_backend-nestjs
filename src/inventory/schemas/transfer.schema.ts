import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Branch } from 'src/branch/schemas/branch.schema';
import { TransactionStatus } from 'src/constant/transaction.enum';
import { Products } from 'src/product/schemas/product.schema';
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
          required: true,
        },
        quantity: { type: Number, required: true },
        variant: mongoose.Schema.Types.ObjectId,
      },
    ],
  })
  items: {
    productId: mongoose.Schema.Types.ObjectId;
    variant: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];

  @Prop({ enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: string;

  @Prop() note: string;

  @Prop({
    type: {
      _id: mongoose.Schema.Types.ObjectId,
      email: String,
      name: String,
    },
  })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    name: string;
  };

  @Prop({
    type: {
      _id: mongoose.Schema.Types.ObjectId,
      email: String,
      name: String,
    },
  })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    name: string;
  };
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
