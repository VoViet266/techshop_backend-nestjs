// casl-ability.factory.ts
import { Injectable } from '@nestjs/common';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  createMongoAbility,
  ExtractSubjectType,
  MongoAbility,
} from '@casl/ability';
import { Actions, Subjects } from 'src/constant/permission.enum';
import { RolesUser } from 'src/constant/roles.enum';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: any) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    const permissions = user.role?.permission || [];
    permissions.forEach((perm: any) => {
      const action = perm.action.toLowerCase();
      const module = perm.module.toLowerCase();
      if (
        Object.values(Actions).includes(action) &&
        Object.values(Subjects).includes(module)
      ) {
        can(action, module);
      }
    });
    console.log('user', user.role);
    if (user.role === RolesUser.Admin) {
      can(Actions.Manage, 'all');
    }
    // Cho phép user chỉ đọc order của chính mình
    can(Actions.Read, Subjects.Inventory, { branch: user.branch });
    can(Actions.Read, Subjects.Order, { user: user._id });

    return build({
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<Subjects>,
    });
  }
}
