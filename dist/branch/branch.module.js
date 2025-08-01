"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchModule = void 0;
const common_1 = require("@nestjs/common");
const branch_service_1 = require("./branch.service");
const branch_controller_1 = require("./branch.controller");
const mongoose_1 = require("@nestjs/mongoose");
const branch_schema_1 = require("./schemas/branch.schema");
const user_schema_1 = require("../user/schemas/user.schema");
const casl_module_1 = require("../casl/casl.module");
let BranchModule = class BranchModule {
};
exports.BranchModule = BranchModule;
exports.BranchModule = BranchModule = __decorate([
    (0, common_1.Module)({
        controllers: [branch_controller_1.BranchController],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: branch_schema_1.Branch.name, schema: branch_schema_1.BranchSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            casl_module_1.CaslModule,
        ],
        providers: [branch_service_1.branchService],
    })
], BranchModule);
//# sourceMappingURL=branch.module.js.map