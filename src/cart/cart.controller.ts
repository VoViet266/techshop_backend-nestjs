import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,

} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/decorator/userDecorator';
import { IUser } from 'src/user/interface/user.interface';

import { ResponseMessage } from 'src/decorator/messageDecorator';

@Controller('api/v1/carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @User() user: IUser) {
    return this.cartService.create(createCartDto, user);
  }

  @Get()
  findAll(@User() user: IUser) {
    return this.cartService.findAll(user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete('remove-all')
  @ResponseMessage('Xóa giỏ hàng thành công')
  remove(@User() user: IUser) {
    return this.cartService.remove(user);
  }

  @Delete('remove-item')
  @ResponseMessage('Xóa item thành công')
  async removeItem(
    @User() user: IUser,
    @Body('productId') productId: string,
    @Body('variantId') variantId: string,
  ) {
    return this.cartService.removeItemFromCart(user, productId, variantId);
  }
}
