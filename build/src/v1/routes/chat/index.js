"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rescue_1 = __importDefault(require("express-rescue"));
const express_1 = require("express");
const chat_controller_1 = require("../../controllers/chat/chat.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const chatRouter = (0, express_1.Router)();
chatRouter.route('/').post(auth_1.default, (0, express_rescue_1.default)(chat_controller_1.createDocumentHistory));
chatRouter.route('/embedding').post((0, express_rescue_1.default)(chat_controller_1.generateEmbedding));
chatRouter.route('/').get(auth_1.default, (0, express_rescue_1.default)(chat_controller_1.getUsersDocuments));
chatRouter.route('/:id').get(auth_1.default, (0, express_rescue_1.default)(chat_controller_1.getUsersDocumentById));
chatRouter.route('/:id').delete(auth_1.default, (0, express_rescue_1.default)(chat_controller_1.deleteUsersDocumentById));
exports.default = chatRouter;
//# sourceMappingURL=index.js.map