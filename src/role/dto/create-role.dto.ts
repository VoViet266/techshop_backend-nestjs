export class CreateRoleDto {
  name: string;
  description?: string;
  permissions?: string[]; // Array of permission IDs or names
  createdAt?: Date;
  updatedAt?: Date;
}
