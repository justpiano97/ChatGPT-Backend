"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rescue_1 = __importDefault(require("express-rescue"));
const express_1 = require("express");
const user_controller_1 = require("../../controllers/user/user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const authRouter = (0, express_1.Router)();
authRouter.route('/:id').get(auth_1.default, (0, express_rescue_1.default)(user_controller_1.getUserById));
authRouter.route('/:id').put(auth_1.default, (0, express_rescue_1.default)(user_controller_1.updateUserById));
exports.default = authRouter;
//# sourceMappingURL=index.js.map