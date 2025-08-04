import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_POLICIES_KEY } from 'src/decorator/policies.decorator';
import { PolicyHandler } from '../../casl/policy.interface';
import {
  AppAbility,
  CaslAbilityFactory,
} from '../../casl/casl-ability.factory/casl-ability.factory';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const ability = (await this.caslAbilityFactory.createForUser(
      user,
    )) as AppAbility;
    const canProceed = policyHandlers.every((handler) => handler(ability));
    if (!canProceed) {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }

    return true;
  }
}
