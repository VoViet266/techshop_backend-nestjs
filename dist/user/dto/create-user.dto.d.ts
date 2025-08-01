export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export declare class CreateUserDto {
    name: string;
    branch: string;
    email: string;
    password: string;
    phone?: string;
    address?: string[];
    age?: number;
    refreshToken: string;
    avatar?: string;
    role?: string;
    status?: string;
}
declare class AddressDto {
    specificAddress: string;
    addressDetail: string;
    default: boolean;
}
export declare class RegisterUserDto {
    name: string;
    password: string;
    avatar?: string;
    email: string;
    addresses: AddressDto[];
    phone?: string;
    age?: number;
    role: string[];
    gender?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export {};
