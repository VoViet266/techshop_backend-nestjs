"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDashboardDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_dashboard_dto_1 = require("./create-dashboard.dto");
class UpdateDashboardDto extends (0, swagger_1.PartialType)(create_dashboard_dto_1.CreateDashboardStatsDto) {
}
exports.UpdateDashboardDto = UpdateDashboardDto;
//# sourceMappingURL=update-dashboard.dto.js.map