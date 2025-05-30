export class CreatePromotionDto {
  title: string;
  description: string;
  discountType: string;
  discountValue: number;
  maxDiscountValue: number;
  startDate: Date;
  isForNewUsersOnly: boolean;
  isActive: boolean;
}
