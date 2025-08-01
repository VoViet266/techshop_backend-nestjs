"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBenefitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_benefit_dto_1 = require("./create-benefit.dto");
class UpdateBenefitDto extends (0, swagger_1.PartialType)(create_benefit_dto_1.CreateBenefitDto) {
}
exports.UpdateBenefitDto = UpdateBenefitDto;
//# sourceMappingURL=update-benefit.dto.js.map