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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from 'src/decorator/publicDecorator';
import { ResponseMessage } from 'src/decorator/messageDecorator';
import { User } from 'src/decorator/userDecorator';
import { IUser } from 'src/user/interface/user.interface';

@Controller('api/v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Public()
  @ResponseMessage('Lấy danh sách sản phẩm thành công')
  findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    return this.productService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Lấy sản phẩm thành công')
  findOne(@Param('id') id: string) {
    return this.productService.findOneById(id);
  }
  // @Public()
  // @ResponseMessage('Tìm kiếm sản phẩm thành công')
  // @Get('/search')
  // async autocomplete(@Query('q') query: string) {
  //   return this.productService.autocompleteSearch(query);
  // }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
