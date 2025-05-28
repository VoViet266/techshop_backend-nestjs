class VariantDto {
  variantId: string;
  stock: number;
  cost: number;
}

export class CreateInventoryDto {
  store: string;
  product: string;
  variants: VariantDto[];
}
