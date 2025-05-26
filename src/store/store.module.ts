import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './schemas/store.schema';

@Module({
  controllers: [StoreController],
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]), // Add your schemas here
  ],
  providers: [StoreService],
})
export class StoreModule {}
