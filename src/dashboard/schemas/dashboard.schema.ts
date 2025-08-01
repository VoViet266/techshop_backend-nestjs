import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type DashboardDocument = HydratedDocument<Dashboard>;

@Schema()
export class ProductStats {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ default: 0 })
  soldCount?: number;

  @Prop({ default: 0 })
  revenue?: number;

  @Prop({ default: 0 })
  viewCount?: number;
}

@Schema()
export class PaymentMethodStats {
  @Prop({ required: true })
  method: string;

  @Prop({ default: 0 })
  count: number;

  @Prop({ default: 0 })
  amount: number;

  @Prop({ default: 0 })
  percentage: number;
}

@Schema({ timestamps: true })
export class Dashboard {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, enum: ['daily', 'weekly', 'monthly', 'yearly'] })
  period: string;

  @Prop({ default: 0 })
  totalRevenue: number;

  @Prop({ default: 0 })
  totalOrders: number;

  @Prop({ default: 0 })
  totalProfit: number;

  @Prop({ default: 0 })
  averageOrderValue: number;

  // Product data
  @Prop({ type: [ProductStats], default: [] })
  topSellingProducts: ProductStats[];

  @Prop({ type: [ProductStats], default: [] })
  mostViewedProducts: ProductStats[];

  // Return & Payment
  @Prop({ default: 0 })
  totalReturns: number;

  @Prop({ default: 0 })
  returnRate: number;

  @Prop({ type: Object, default: {} })
  branchOverview: any;

  @Prop({ type: [PaymentMethodStats], default: [] })
  paymentMethods: PaymentMethodStats[];

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const DashboardStatsSchema = SchemaFactory.createForClass(Dashboard);
