import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Promotion,
  PromotionDocument,
} from '../benefit/schemas/promotion.schema';
import {
  WarrantyPolicy,
  WarrantyPolicyDocument,
} from '../benefit/schemas/warrantypolicy.schema';

@Injectable()
export class ProductBenefitService {
  constructor(
    @InjectModel(Promotion.name)
    private promotionModel: Model<PromotionDocument>,

    @InjectModel(WarrantyPolicy.name)
    private warrantyModel: Model<WarrantyPolicyDocument>,
  ) {}

  // ============ PROMOTIONS ============

  async createPromotion(data: Partial<Promotion>) {
    return this.promotionModel.create(data);
  }

  async getAllPromotions(categoryId?: string) {
    const filter: any = {};
    if (categoryId) {
      filter.$or = [
        { categories: categoryId },
        { categories: { $size: 0 } },
        { categories: { $exists: false } },
        { categories: null },
      ];
    }
    return this.promotionModel.find(filter);
  }

  async getPromotionById(id: string) {
    return this.promotionModel.findById(id);
  }

  async updatePromotion(id: string, data: Partial<Promotion>) {
    return this.promotionModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePromotion(id: string) {
    return this.promotionModel.findByIdAndDelete(id);
  }
  // ============ WARRANTY POLICIES ============

  async createWarrantyPolicy(data: Partial<WarrantyPolicy>) {
    return this.warrantyModel.create(data);
  }

  async getAllWarranties(categoryId?: string) {
    const filter: any = {};
    if (categoryId) {
      filter.$or = [
        { categories: categoryId },
        { categories: { $size: 0 } },
        { categories: { $exists: false } },
        { categories: null },
      ];
    }
    return this.warrantyModel.find(filter);
  }

  async getWarrantyById(id: string) {
    return this.warrantyModel.findById(id);
  }

  async updateWarranty(id: string, data: Partial<WarrantyPolicy>) {
    return this.warrantyModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteWarranty(id: string) {
    return this.warrantyModel.findByIdAndDelete(id);
  }
}
