export class CreateBannerDto {
  title: string;
  description: string;
  imageUrl: string;
  linkTo: string;
  position: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}
