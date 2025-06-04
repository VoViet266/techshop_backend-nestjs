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

// export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
// export type Subjects = 'Product' | 'Order' | 'User' | 'all';

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

    if (user.role?.roleName === RolesUser.Admin) {
      can(Actions.Manage, 'all');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<Subjects>,
    });
  }
}
