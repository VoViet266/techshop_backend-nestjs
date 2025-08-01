"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaslAbilityFactory = void 0;
const common_1 = require("@nestjs/common");
const ability_1 = require("@casl/ability");
const permission_enum_1 = require("../../constant/permission.enum");
const roles_enum_1 = require("../../constant/roles.enum");
let CaslAbilityFactory = class CaslAbilityFactory {
    createForUser(user) {
        const { can, cannot, build } = new ability_1.AbilityBuilder(ability_1.createMongoAbility);
        const permissions = user.role?.permission || [];
        permissions.forEach((perm) => {
            const action = perm.action.toLowerCase();
            const module = perm.module.toLowerCase();
            if (Object.values(permission_enum_1.Actions).includes(action) &&
                Object.values(permission_enum_1.Subjects).includes(module)) {
                can(action, module);
            }
        });
        console.log('user', user.role);
        if (user.role === roles_enum_1.RolesUser.Admin) {
            can(permission_enum_1.Actions.Manage, 'all');
        }
        can(permission_enum_1.Actions.Read, permission_enum_1.Subjects.Inventory, { branch: user.branch });
        can(permission_enum_1.Actions.Read, permission_enum_1.Subjects.Order, { user: user._id });
        return build({
            detectSubjectType: (item) => item.constructor,
        });
    }
};
exports.CaslAbilityFactory = CaslAbilityFactory;
exports.CaslAbilityFactory = CaslAbilityFactory = __decorate([
    (0, common_1.Injectable)()
], CaslAbilityFactory);
//# sourceMappingURL=casl-ability.factory.js.map