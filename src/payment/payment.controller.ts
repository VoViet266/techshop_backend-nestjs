import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/decorator/userDecorator';
import { IUser } from 'src/user/interface/user.interface';
import { PaymentStatus } from 'src/constant/payment.enum';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Order, OrderDocument } from 'src/order/schemas/order.schema';
import { Payment, PaymentDocument } from './schemas/payment.schema';
@Controller('api/v1/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // @Post()
  // create(@Body() createPaymentDto: CreatePaymentDto) {
  //   return this.paymentService.create(createPaymentDto);
  // }
  @Post('create-payment')
  async create(@Body() dto: CreatePaymentDto, @User() user: IUser) {
    const result = await this.paymentService.createPayment(dto, user);
    return {
      payUrl: result.payUrl,
    };
  }
  @Post('notify')
  async handleNotification(@Body() ipnData: any, @User() user: IUser) {
    try {
      console.log('Received MoMo IPN:', ipnData);

      const result = await this.paymentService.handleMoMoIPN(ipnData, user);

      // MoMo expects specific response format
      return {
        partnerCode: ipnData.partnerCode,
        requestId: ipnData.requestId,
        orderId: ipnData.orderId,
        resultCode: result.resultCode,
        message: result.message,
        responseTime: Date.now(),
        extraData: ipnData.extraData,
        signature: ipnData.signature,
      };
    } catch (error) {
      console.error('IPN handling error:', error);

      // Still return success to MoMo to avoid retries
      return {
        partnerCode: ipnData.partnerCode,
        requestId: ipnData.requestId,
        orderId: ipnData.orderId,
        resultCode: 99,
        message: 'Error processing IPN',
        responseTime: Date.now(),
        extraData: ipnData.extraData,
        signature: ipnData.signature,
      };
    }
  }
}
