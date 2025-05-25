export class CreateVariantDto {
  name: string;
  price: number;
  color: string;
  ram: string;
  stock: number;
  storage?: string;
  image?: string[];
}

export class CreateCamerasDto {
  frontCamera?: string;
  rearCamera?: string;
  videoRecording?: string;
}

export class CreateConnectivitiesDto {
  wifi?: string;
  bluetooth?: string;
  network?: string;
  nfc?: boolean;
  gps?: boolean;
  usb?: string;
}

export class CreateProductDto {
  name: string;
  price: number
  description?: string;
  category: string; // ObjectId
  brand: string; // ObjectId
  variants: CreateVariantDto;
  cameras: CreateCamerasDto;
  connectivities: CreateConnectivitiesDto;
  isActive?: boolean;
}
