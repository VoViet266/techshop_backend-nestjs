import { Module } from '@nestjs/common';
import { branchService } from './branch.service';
import { BranchController } from './branch.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from './schemas/branch.schema';

@Module({
  controllers: [BranchController],
  imports: [
    MongooseModule.forFeature([{ name: Branch.name, schema: BranchSchema }]),
  ],
  providers: [branchService],
})
export class BranchModule {}
