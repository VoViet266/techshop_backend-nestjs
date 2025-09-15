import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from 'src/decorator/publicDecorator';
import { ResponseMessage } from 'src/decorator/messageDecorator';

import { PoliciesGuard } from 'src/common/guards/policies.guard';
import { CheckPolicies } from 'src/decorator/policies.decorator';
import { Actions, Subjects } from 'src/constant/permission.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReviewService } from 'src/review/review.service';

@Controller('api/v1/products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly reviewService: ReviewService,
  ) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Read, Subjects.Product))
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
  // @Post('insert')
  // @Public()
  // Insert(@Body() createProductDto: CreateProductDto[]) {
  //   return this.productService.insertManyProduct(createProductDto);
  // }

  // @Post('import-csv')
  // @UseInterceptors(FileInterceptor('file'))
  // async importCSV(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) throw new BadRequestException('File không được để trống');

  //   const filePath = file.path;

  //   const result = await this.productService.importProductsFromCsv(filePath);
  //   return result;
  // }

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

  @Get('/:id')
  @Public()
  @ResponseMessage('Lấy sản phẩm thành công')
  findOne(@Param('id') id: string) {
    return this.productService.findOneById(id);
  }

  @Public()
  @Get('/search/autocomplete')
  async autocomplete(@Query('query') query: string) {
    return this.productService.autocompleteSearch(query);
  }
  @Public()
  @Get(':productId/rating-stats')
  async getRatingStats(@Param('productId') productId: string) {
    const stats = await this.reviewService.getProductRatingStats(productId);
    return {
      success: true,
      data: stats,
    };
  }
  @Patch('/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Update, Subjects.Product))
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Delete, Subjects.Product))
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Patch('/:id/view-count')
  @Public()
  setViewCount(@Param('id') id: string) {
    return this.productService.countViews(id);
  }

  @Patch('/:id/order-count')
  @Public()
  setOrderCount(@Param('id') id: string) {
    return this.productService.countOrders(id);
  }
}
