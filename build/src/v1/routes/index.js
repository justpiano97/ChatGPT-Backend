"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const subscription_1 = __importDefault(require("./subscription"));
const chat_1 = __importDefault(require("./chat"));
const router = (0, express_1.Router)();
router.use('/api/v1/auth', auth_1.default);
router.use('/api/v1/user', user_1.default);
router.use('/api/v1/subscription', subscription_1.default);
router.use('/api/v1/history', chat_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map