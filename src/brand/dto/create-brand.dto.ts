

export class CreateBrandDto {
  name: string
  description?: string;
  logo?: string;

  

  // Nếu cần mở thêm các trường khác, bạn có thể thêm như sau:

  // @ApiPropertyOptional({
  //   example: 'https://apple.com',
  //   description: 'Website chính thức của thương hiệu',
  // })
  // @IsUrl()
  // @IsOptional()
  // websiteUrl?: string;

  // @ApiPropertyOptional({
  //   example: 'contact@apple.com',
  //   description: 'Email liên hệ',
  // })
  // @IsEmail()
  // @IsOptional()
  // contactEmail?: string;

  // @ApiPropertyOptional({
  //   example: '+1-800-123-4567',
  //   description: 'Số điện thoại liên hệ',
  // })
  // @IsString()
  // @IsOptional()
  // contactPhone?: string;

  // @ApiPropertyOptional({
  //   example: '1 Infinite Loop, Cupertino, CA',
  //   description: 'Địa chỉ',
  // })
  // @IsString()
  // @IsOptional()
  // address?: string;

  // @ApiPropertyOptional({ example: 1976, description: 'Năm thành lập' })
  // @IsNumber()
  // @Min(1800)
  // @Max(new Date().getFullYear())
  // @IsOptional()
  // establishedYear?: number;

  // @ApiPropertyOptional({
  //   example: { facebook: 'fb.com/apple', twitter: 'twitter.com/apple' },
  //   description: 'Các liên kết mạng xã hội',
  // })
  // @IsObject()
  // @IsOptional()
  // socialMediaLinks?: Record<string, string>;
}
