import { Types } from 'mongoose';

export class ImportProductFromCsvDto {
  name: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  discount: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  variants: Types.ObjectId[]; // vì bạn dùng createdVariants.map(v => v._id)

  specifications: {
    displaySize: string;
    displayType: string;
    processor: string;
    operatingSystem: string;
    battery: string;
    weight: string;
    dimensions: string;
  };

  connectivity: {
    wifi: string;
    bluetooth: string;
    cellular: string;
    nfc: boolean;
    gps: boolean;
    ports: string[];
  };

  camera: {
    front: {
      resolution: string;
      features: string[];
    };
    rear: {
      resolution: string;
      features: string[];
      lensCount: number;
    };
    videoRecording: string[];
  };

  viewCount: number;
  averageRating: number;
  reviewCount: number;
}
