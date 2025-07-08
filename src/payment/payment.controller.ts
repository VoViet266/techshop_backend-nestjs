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
  @Post('momo/notify')
  async handleCallback(@Body() body: any) {
    const { orderId, transId, resultCode, message, payType, responseTime } =
      body;

    const status =
      resultCode === 0 ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;

    await this.paymentService.updatePaymentStatus({
      orderId,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      status,
    });

    return { message: 'Callback received' };
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }
}
