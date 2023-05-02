import rescue from 'express-rescue';
import { Router } from 'express';
import { cancelSubScription, createCustomer, getCustomerInfo, getSubsciptionPlans, handleSuccess, stripeCheckoutSession, subscribePlan, webhook } from '../../controllers/subscription/subscription.controller';
import authMiddleware from '../../middlewares/auth';

const subScriptionRouter = Router();

subScriptionRouter.route('/customer').post(authMiddleware, rescue(createCustomer));
subScriptionRouter.route('/customer').get(authMiddleware, rescue(getCustomerInfo));
subScriptionRouter.route('/plan').get(rescue(getSubsciptionPlans));
subScriptionRouter.route('/subscribe').post(authMiddleware, rescue(subscribePlan));
subScriptionRouter.route('/subscribe').delete(authMiddleware, rescue(cancelSubScription));
subScriptionRouter.route('/create-checkout-session').post(authMiddleware, rescue(stripeCheckoutSession));
subScriptionRouter.route('/success').post(authMiddleware, rescue(handleSuccess));
subScriptionRouter.route('/webhook').post(authMiddleware, webhook);

export default subScriptionRouter;