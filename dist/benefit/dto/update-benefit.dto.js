"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBenefitDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_benefit_dto_1 = require("./create-benefit.dto");
class UpdateBenefitDto extends (0, mapped_types_1.PartialType)(create_benefit_dto_1.CreateBenefitDto) {
}
exports.UpdateBenefitDto = UpdateBenefitDto;
//# sourceMappingURL=update-benefit.dto.js.map