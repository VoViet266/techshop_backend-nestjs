export class CreateCategoryDto {
  name: string;
  description?: string;
  logo?: string;
  slug: string;
  configFields?: Record<string, any>;
  isActive?: boolean;
}
