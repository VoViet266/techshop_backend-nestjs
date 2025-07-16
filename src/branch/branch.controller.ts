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
import { branchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Public } from 'src/decorator/publicDecorator';
import { PoliciesGuard } from 'src/common/guards/policies.guard';
import { CheckPolicies } from 'src/decorator/policies.decorator';
import { Actions, Subjects } from 'src/constant/permission.enum';
@Controller('api/v1/branchs')
export class BranchController {
  constructor(private readonly branchService: branchService) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Create, Subjects.Branch))
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.branchService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Actions.Update, Subjects.Branch))
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    const storeExists = this.branchService.findOne(id);
    if (!storeExists) {
      throw new Error(`branch with id ${id} does not exist`);
    }
    return this.branchService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(
    (ability) =>
      ability.can(Actions.Update, Subjects.Branch) ||
      ability.can(Actions.Delete, Subjects.Branch),
  )
  remove(@Param('id') id: string) {
    return this.branchService.remove(id);
  }
}
