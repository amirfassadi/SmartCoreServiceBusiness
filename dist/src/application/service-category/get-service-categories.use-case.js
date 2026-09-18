"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceCategoriesUseCase = void 0;
const require_business_scope_1 = require("../shared/require-business-scope");
class GetServiceCategoriesUseCase {
    businessRepository;
    categoryRepository;
    constructor(businessRepository, categoryRepository) {
        this.businessRepository = businessRepository;
        this.categoryRepository = categoryRepository;
    }
    async execute(context) {
        await (0, require_business_scope_1.requireBusinessScope)(this.businessRepository, context);
        return this.categoryRepository.listByBusiness(context);
    }
}
exports.GetServiceCategoriesUseCase = GetServiceCategoriesUseCase;
