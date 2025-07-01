import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/decorator/userDecorator';
import { IUser } from './interface/user.interface';
import { Public } from 'src/decorator/publicDecorator';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const existingUser = this.userService.findOne(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @Patch('change-password')
  changePassword(
    @Body()
    changePassword: ChangePasswordDto,
    @User() user: IUser,
  ) {
    return this.userService.changePassword(changePassword, user);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('update-role/:id')
  updateRole(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateRole(id, updateUserDto.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
