import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDate,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
} from 'src/constant/payment.enum';

export class CreatePaymentDto {
  @ApiProperty({ example: '64a2b3c4d5e6f7890a1b2c3d', description: 'ID đơn hàng' })
  @IsMongoId()
  order: string;

  @ApiProperty({ example: '64a2b3c4d5e6f7890a1b2c3e', description: 'ID người dùng' })
  @IsMongoId()
  user: string;

  @ApiProperty({ example: 150000, description: 'Số tiền thanh toán' })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Phương thức thanh toán' })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ enum: PaymentStatus, description: 'Trạng thái thanh toán' })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({ example: 'TX1234567890', description: 'Mã giao dịch' })
  @IsOptional()
  @IsString()
  transactionCode?: string;

  @ApiPropertyOptional({ example: '2025-06-04T10:00:00Z', description: 'Ngày giao dịch' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  transactionDate?: Date;

  @ApiPropertyOptional({ enum: RefundStatus, description: 'Trạng thái hoàn tiền' })
  @IsOptional()
  @IsEnum(RefundStatus)
  refundStatus?: RefundStatus;
}
