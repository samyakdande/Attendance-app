"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationOptions = getPaginationOptions;
function getPaginationOptions(params) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}
//# sourceMappingURL=pagination.interface.js.map