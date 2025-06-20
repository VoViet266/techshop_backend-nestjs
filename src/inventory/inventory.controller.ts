import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  CreateInventoryDto,
  CreateStockMovementDto,
  CreateTransferDto,
} from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PoliciesGuard } from 'src/common/guards/policies.guard';
import { CheckPolicies } from 'src/decorator/policies.decorator';
import { Actions, Subjects } from 'src/constant/permission.enum';
import { User } from 'src/decorator/userDecorator';
import { use } from 'passport';
import { IUser } from 'src/user/interface/user.interface';
import { Public } from 'src/decorator/publicDecorator';
@ApiBearerAuth('access-token')
@Controller('api/v1/inventories')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto, @User() user: IUser) {
    return this.inventoryService.create(createInventoryDto, user);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Read, Subjects.Inventory))
  findAll(@User() user: IUser) {
    return this.inventoryService.findAll(user);
  }

  @Get('/getImport')
  findImport(@User() user: IUser) {
    return this.inventoryService.findImport(user);
  }

  @Get('/getExport')
  findExport(@User() user: IUser) {
    return this.inventoryService.findExport(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }

  @Post('import')
  async importStock(@Body() dto: CreateStockMovementDto, @User() user: IUser) {
    return this.inventoryService.importStock(dto, user);
  }

  @Get('getimport')
  @Public()
  async getAllImport(@User() user: IUser) {
    return this.inventoryService.findImport(user);
  }

  @Get('getimport/:id')
  async getImport(@Param('id') id: string) {
    return this.inventoryService.getImportDetail(id);
  }

  @Get('getexport')
  async getAllExport(@User() user: IUser) {
    return this.inventoryService.findExport(user);
  }

  @Get('getexport/:id')
  async getExport(@Param('id') id: string) {
    return this.inventoryService.getExportDetail(id);
  }

  @Post('export')
  async exportStock(@Body() dto: CreateStockMovementDto, @User() user: IUser) {
    return this.inventoryService.exportStock(dto, user);
  }

  @Post('transfer')
  async transferStock(@Body() dto: CreateTransferDto, @User() user: IUser) {
    return this.inventoryService.transferStock(dto, user);
  }
}
