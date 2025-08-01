import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class CreateBranchDto {
 
  name: string;


  address: string;

  
  phone: string;
  location: string;


  email: string;


  isActive?: boolean;
}
