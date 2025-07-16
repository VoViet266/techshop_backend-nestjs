import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromotionDocument = Promotion & Document;

@Schema({ timestamps: true })
export class Promotion {
  @Prop({ required: true })
  title: string;

  @Prop({ enum: ['fixed', 'percent'], required: true })
  valueType: 'fixed' | 'percent';

  @Prop({ required: true })
  value: number;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  // Các điều kiện áp dụng
  @Prop({
    type: {
      minOrder: { type: Number, default: 0 }, // đơn tối thiểu để áp dụng
      payment: {
        type: String,
        enum: ['CASH', 'MOMO', 'BANK', 'COD'],
        required: false,
      }, // phương thức thanh toán cụ thể
      // Có thể mở rộng thêm:
      // branch: [String] → áp dụng cho một số chi nhánh
      // userLevel: String → thành viên VIP, thường...
    },
    default: {},
  })
  conditions: {
    minOrder?: number;
    payment?: string;
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
