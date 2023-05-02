"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
exports.default = (err, _req, res, _next) => {
    var _a;
    if (err.status)
        return res.status(err.status).json({ message: err.message });
    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (_a = err.message) !== null && _a !== void 0 ? _a : 'Internal server error' });
};
//# sourceMappingURL=error.js.map