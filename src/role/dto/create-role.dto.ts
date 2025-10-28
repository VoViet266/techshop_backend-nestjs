export class CreateRoleDto {
  name: string;

  description?: string;

  permissions?: string[];

  createdAt?: Date;

  updatedAt?: Date;
}
