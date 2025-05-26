class VariantSkuDto {
  variantId: string;
  quantity: number;
}

export class CreateInventoryDto {
  store: string;
  product: string;
  variant: VariantSkuDto[];
}
