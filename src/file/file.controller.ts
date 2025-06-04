import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Req,
  NotFoundException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { ResponseMessage } from 'src/decorator/messageDecorator';
import { Public } from 'src/decorator/publicDecorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('api/v1/upload')
export class FileController {
  private readonly Base_URL: string;
  private readonly PORT: string;

  constructor(private readonly configService: ConfigService) {
    this.Base_URL = this.configService.get<string>('BASE_URL');
    this.PORT = this.configService.get<string>('PORT');
  }

  // @Post('upload')
  // @ResponseMessage('Upload file thành công')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: /^image\/(png|jpe?g|gif|webp)$/,
  //       })
  //       .addMaxSizeValidator({
  //         maxSize: 1024 * 2000,
  //       })
  //       .build({
  //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //       }),
  //   )
  //   file: Express.Multer.File,
  //   @Req() request: Request,
  // ) {
  //   const filePath = `${this.Base_URL}${this.PORT}/uploads/${file.filename}`;
  //   console.log(filePath);
  //   return {
  //     filePath: filePath,
  //     filename: file.filename,
  //   };
  // }

  // @Delete('delete/:filename')
  // @Public()
  // @ResponseMessage('Xóa file thành công')
  // async deleteFile(@Param('filename') filename: string) {
  //   try {
  //     // Xác định đường dẫn file
  //     const filePath = path.join(process.cwd(), 'public/uploads', filename);

  //     // Kiểm tra xem file có tồn tại không
  //     if (!fs.existsSync(filePath)) {
  //       throw new NotFoundException(`File ${filename} không tồn tại`);
  //     }

  //     // Xóa file
  //     fs.unlinkSync(filePath);
  //     console.log(`File ${filename} đã được xóa thành công`);
  //     return {
  //       filename,
  //       message: `File ${filename} đã được xóa thành công`,
  //     };
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new Error(`Không thể xóa file: ${error.message}`);
  //   }
  // }

  @Post('excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Chuyển dữ liệu từ Excel thành JSON
    const data = XLSX.utils.sheet_to_json(sheet);
    // TODO: Lưu vào DB nếu cần
    const tt = data.map((row) => this.unflattenObject(row));
    return { message: 'Upload thành công', data };
  }
  public unflattenObject(flat: Record<string, any>) {
    const result = {};
    for (const key in flat) {
      const keys = key.split(/[\.\[\]]/).filter((k) => k !== '');
      keys.reduce((acc, cur, i) => {
        if (i === keys.length - 1) {
          acc[cur] = flat[key];
          return;
        }
        acc[cur] = acc[cur] || (isNaN(Number(keys[i + 1])) ? {} : []);
        return acc[cur];
      }, result);
    }
    return result;
  }
}
