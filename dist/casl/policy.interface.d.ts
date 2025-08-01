import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
export type PolicyHandler = (ability: AppAbility) => boolean;
