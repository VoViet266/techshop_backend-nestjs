import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
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

import { IUser } from 'src/user/interface/user.interface';

@ApiBearerAuth('access-token')
@Controller('api/v1/inventories')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Create, Subjects.Inventory))
  create(@Body() createInventoryDto: CreateInventoryDto, @User() user: IUser) {
    return this.inventoryService.create(createInventoryDto, user);
  }

  @Get()
  findAll(@User() user: IUser) {
    return this.inventoryService.findAll(user);
  }

  @Get('check-stock')
  findOne(
    @Query('productId') productId: string,
    @Query('branchId') branchId: string,
    @Query('variantId') variantId: string,
  ) {
    return this.inventoryService.getStockProduct(
      productId,
      branchId,
      variantId,
    );
  }

  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Update, Subjects.Inventory))
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
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Create, Subjects.Inventory))
  async importStock(@Body() dto: CreateStockMovementDto, @User() user: IUser) {
    return this.inventoryService.importStock(dto, user);
  }

  @Get('getimport')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Read, Subjects.Inventory))
  async getAllImport(@User() user: IUser) {
    return this.inventoryService.findImport(user);
  }

  @Get('getimport/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Read, Subjects.Inventory))
  async getImport(@Param('id') id: string) {
    return this.inventoryService.getImportDetail(id);
  }

  @Get('getexport')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Read, Subjects.Inventory))
  async getAllExport(@User() user: IUser) {
    return this.inventoryService.findExport(user);
  }

  @Get('getexport/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Read, Subjects.Inventory))
  async getExport(@Param('id') id: string) {
    return this.inventoryService.getExportDetail(id);
  }

  @Post('export')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) =>
    ability.can(Actions.Create, Subjects.StockMovement),
  )
  async exportStock(@Body() dto: CreateStockMovementDto, @User() user: IUser) {
    return this.inventoryService.exportStock(dto, user);
  }

  @Get('/transfer')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Read, Subjects.Transfer))
  async getAllTransfer() {
    return this.inventoryService.findTransfer();
  }

  @Post('/transfer')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Create, Subjects.Transfer))
  async transferStock(@Body() dto: CreateTransferDto, @User() user: IUser) {
    return this.inventoryService.transferStock(dto, user);
  }

  @Get('get_transfer/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Read, Subjects.Transfer))
  async getTransferDetail(@Param('id') id: string) {
    return this.inventoryService.getTransferDetail(id);
  }

  @Patch('/transfer/:id')
  async updateTransfer(
    @Param('id') id: string,
    @Body() dto: CreateTransferDto,
    @User() user: IUser,
  ) {
    return this.inventoryService.updateTransfer(id, dto, user);
  }
}
