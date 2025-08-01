import { MongoAbility } from '@casl/ability';
import { Actions, Subjects } from 'src/constant/permission.enum';
export type AppAbility = MongoAbility<[Actions, Subjects]>;
export declare class CaslAbilityFactory {
    createForUser(user: any): MongoAbility<import("@casl/ability").AbilityTuple, import("@casl/ability").MongoQuery>;
}
