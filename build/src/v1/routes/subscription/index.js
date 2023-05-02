"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rescue_1 = __importDefault(require("express-rescue"));
const express_1 = require("express");
const subscription_controller_1 = require("../../controllers/subscription/subscription.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const subScriptionRouter = (0, express_1.Router)();
subScriptionRouter.route('/customer').post(auth_1.default, (0, express_rescue_1.default)(subscription_controller_1.createCustomer));
subScriptionRouter.route('/customer').get(auth_1.default, (0, express_rescue_1.default)(subscription_controller_1.getCustomerInfo));
subScriptionRouter.route('/plan').get((0, express_rescue_1.default)(subscription_controller_1.getSubsciptionPlans));
subScriptionRouter.route('/subscribe').post(auth_1.default, (0, express_rescue_1.default)(subscription_controller_1.subscribePlan));
subScriptionRouter.route('/subscribe').delete(auth_1.default, (0, express_rescue_1.default)(subscription_controller_1.cancelSubScription));
subScriptionRouter.route('/create-checkout-session').post(auth_1.default, (0, express_rescue_1.default)(subscription_controller_1.stripeCheckoutSession));
subScriptionRouter.route('/success').post(auth_1.default, (0, express_rescue_1.default)(subscription_controller_1.handleSuccess));
subScriptionRouter.route('/webhook').post(auth_1.default, subscription_controller_1.webhook);
exports.default = subScriptionRouter;
//# sourceMappingURL=index.js.map