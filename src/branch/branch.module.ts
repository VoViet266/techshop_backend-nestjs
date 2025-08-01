import { Module } from '@nestjs/common';
import { branchService } from './branch.service';
import { BranchController } from './branch.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from './schemas/branch.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [BranchController],
  imports: [
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CaslModule,
  ],
  providers: [branchService],
})
export class BranchModule {}
