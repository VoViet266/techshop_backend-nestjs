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
  UseGuards,
} from '@nestjs/common';
import { CloundinaryService } from './cloundinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorator/publicDecorator';
import { v2 as cloudinary } from 'cloudinary';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PoliciesGuard } from 'src/common/guards/policies.guard';
import { Actions, Subjects } from 'src/constant/permission.enum';
import { CheckPolicies } from 'src/decorator/policies.decorator';

@ApiBearerAuth('access-token')
@Controller('api/v1/upload')
export class CloundinaryController {
  constructor(private readonly cloundinaryService: CloundinaryService) {}

  @Post('image')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Create, Subjects.Cloudinary))
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds the limit of 5MB');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new Error('Invalid file type. Only images are allowed.');
    }
    console.log('Uploading file to Cloudinary:', file.originalname);
    return this.cloundinaryService.uploadImage(file);
  }

  @Public()
  @Get('image')
  getAllImages(@Query('url') publicId: string) {
    return this.cloundinaryService.getImage(publicId);
  }

  @Delete('image')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Delete, Subjects.Cloudinary))
  async deleteFile(@Query('url') url: string) {
    return await this.cloundinaryService.deleteImage(url);
  }
}
