"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const jwt_1 = require("../utils/jwt");
exports.default = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token)
        return next({
            status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'No token provided',
        });
    try {
        const data = (0, jwt_1.verifyToken)(token.split(' ')[1]);
        res.locals.payload = data;
        return next();
    }
    catch (_a) {
        return next({ status: http_status_codes_1.StatusCodes.UNAUTHORIZED, message: 'Unauthorized' });
    }
};
//# sourceMappingURL=auth.js.map