
import { IsString } from 'class-validator';
import { Actions, Subjects } from 'src/constant/permission.enum';

export class CreatePermissionDto {

  @IsString()
  name: string;


  @IsString()
  description: string;


  @IsString()
  module: Subjects;

 
  @IsString()
  action: Actions;

  isActive: boolean;
}
