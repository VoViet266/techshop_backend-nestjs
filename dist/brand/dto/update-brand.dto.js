"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBrandDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_brand_dto_1 = require("./create-brand.dto");
class UpdateBrandDto extends (0, mapped_types_1.PartialType)(create_brand_dto_1.CreateBrandDto) {
}
exports.UpdateBrandDto = UpdateBrandDto;
//# sourceMappingURL=update-brand.dto.js.map