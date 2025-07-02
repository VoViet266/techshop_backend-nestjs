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
import { Public } from 'src/decorator/publicDecorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PoliciesGuard } from 'src/common/guards/policies.guard';
import { CheckPolicies } from 'src/decorator/policies.decorator';
import { Actions, Subjects } from 'src/constant/permission.enum';
@ApiBearerAuth('access-token')
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
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
