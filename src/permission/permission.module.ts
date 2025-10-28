import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schemas/permission.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
  imports: [
    CaslModule,
    MongooseModule.forFeature([
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
    ]),
  ],
})
export class PermissionModule {}
