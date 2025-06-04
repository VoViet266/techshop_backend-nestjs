import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { CloundinaryService } from './cloundinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorator/publicDecorator';
import { v2 as cloudinary } from 'cloudinary';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('api/v1/upload')
export class CloundinaryController {
  constructor(private readonly cloundinaryService: CloundinaryService) {}

  @Public()
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloundinaryService.uploadImage(file);
  }

  @Public()
  @Get('image')
  getAllImages(@Query('publicId') publicId: string) {
    return this.cloundinaryService.getImage(publicId);
  }
  @Delete('image')
  async deleteFile(@Query('url') url: string) {
    return await this.cloundinaryService.deleteImage(url);
  }
}
