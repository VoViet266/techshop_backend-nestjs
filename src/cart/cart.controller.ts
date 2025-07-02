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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/decorator/userDecorator';
import { IUser } from 'src/user/interface/user.interface';
import { Public } from 'src/decorator/publicDecorator';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth('access-token')
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete('remove-all/:id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.cartService.remove(id, user);
  }

  @Delete('remove-item')
  async removeItem(
    @User() user: IUser,
    @Body('productId') productId: string,
    @Body('variantId') variantId: string,
  ) {
    return this.cartService.removeItemFromCart(user, productId, variantId);
  }
}
