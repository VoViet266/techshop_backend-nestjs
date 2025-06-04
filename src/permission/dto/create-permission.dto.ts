import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'READ',
    description: 'Tên permission, ví dụ: "READ", "WRITE"',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Quyền đọc dữ liệu người dùng',
    description: 'Mô tả quyền',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'USER',
    description: 'Module của permission, ví dụ: "USER", "POST"',
  })
  @IsString()
  module: string;

  @ApiProperty({
    example: 'READ',
    description: 'Action của permission, ví dụ: "READ", "WRITE"',
  })
  @IsString()
  action: string;
}
