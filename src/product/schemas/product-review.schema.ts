// src/product-review/schemas/product-review.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Products } from './product.schema';
import { User } from 'src/user/schemas/user.schema';
// export type ProductReviewDocument = HydratedDocument<ProductReview>;


