import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/decorator/userDecorator';
import { IUser } from 'src/user/interface/user.interface';

import { PoliciesGuard } from 'src/common/guards/policies.guard';
import { CheckPolicies } from 'src/decorator/policies.decorator';
import { Actions, Subjects } from 'src/constant/permission.enum';

@Controller('api/v1/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    return this.orderService.create(createOrderDto, user);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Read, Subjects.Order))
  findAllByStaff(@User() user: IUser) {
    console.log('asdasdas', user);
    return this.orderService.findAllByStaff(user);
  }

  @Get('user')
  findAllByCustomer(@User() user: IUser) {
    return this.orderService.findAllByCustomer(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(
    (ability) =>
      ability.can(Actions.Update, Subjects.Order) &&
      ability.can(Actions.Read, Subjects.Order),
  )
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @User() user: IUser,
  ) {
    return this.orderService.update(id, updateOrderDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @Patch('/cancel/:id')
  cancelOrder(@Param('id') id: string, @User() user: IUser) {
    return this.orderService.cancelOrder(id, user);
  }

  // @Patch('/refund/:id')
  // refundOrder(
  //   @Param('id') id: string,
  //   @User() user: IUser,
  //   dto: {
  //     returnReason: string;
  //     returnStatus: string;
  //     isReturned: boolean;
  //   },
  // ) {
  //   return this.orderService.refundOrder(id, user, {
  //     returnReason: dto.returnReason,
  //     returnStatus: dto.returnStatus,
  //     isReturned: dto.isReturned,
  //   });
  // }

  @Patch('/request-return/:id')
  requestReturn(
    @Param('id') id: string,
    @User() user: IUser,

    @Body()
    dto: {
      returnReason: string;
    },
  ) {
    return this.orderService.requestReturn(id, dto);
  }

  @Patch('/confirm-return/:id')
  confirmReturn(
    @Param('id') id: string,
    @User() user: IUser,
    @Body('returnStatus') returnStatus: string,
  ) {
    console.log(returnStatus);
    return this.orderService.confirmReturn(id, returnStatus, user);
  }
}
