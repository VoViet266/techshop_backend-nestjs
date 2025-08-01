import { Actions, Subjects } from 'src/constant/permission.enum';
export declare class CreatePermissionDto {
    name: string;
    description: string;
    module: Subjects;
    action: Actions;
    isActive: boolean;
}
