"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rescue_1 = __importDefault(require("express-rescue"));
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth/auth.controller");
const authRouter = (0, express_1.Router)();
authRouter.route('/login').post((0, express_rescue_1.default)(auth_controller_1.authorizeUser));
authRouter.route('/refresh-token').post((0, express_rescue_1.default)(auth_controller_1.refreshToken));
authRouter.route('/logout').post((0, express_rescue_1.default)(auth_controller_1.logout));
exports.default = authRouter;
//# sourceMappingURL=index.js.map