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
import { ReviewService } from './review.service';
import { CreateReplyDto, CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Public } from 'src/decorator/publicDecorator';

@Controller('api/v1/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    const comment = await this.reviewService.create(createReviewDto);
    return {
      success: true,
      message: 'Tạo comment thành công',
      data: comment,
    };
  }

  @Get(':productId')
  @Public()
  async findByProduct(
    @Param('productId') productId: string,
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    console.log('csca', currentPage, limit);
    const result = await this.reviewService.findByProduct(
      productId,
      +currentPage,
      +limit,
      qs,
    );
    return {
      data: result,
    };
  }
  @Post(':commentId/reply')
  async addReply(
    @Param('commentId') commentId: string,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    const reply = await this.reviewService.addReply(commentId, createReplyDto);
    return {
      success: true,
      message: 'Thêm phản hồi thành công',
      data: reply,
    };
  }
}
