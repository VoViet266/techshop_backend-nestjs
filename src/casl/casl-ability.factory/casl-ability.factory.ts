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
import { UserService } from 'src/user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}
  async createForUser(user: any) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    const userInfo = await this.userModel.findById(user._id).populate({
      path: 'role',
      populate: {
        path: 'permissions',
        select: 'name module action',
      },
    });

    const permissions = userInfo?.role?.permissions || [];

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
