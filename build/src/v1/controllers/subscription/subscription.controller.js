"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSuccess = exports.webhook = exports.stripeCheckoutSession = exports.cancelSubScription = exports.getSubsciptionPlans = exports.getCustomerInfo = exports.subscribePlan = exports.createCustomer = void 0;
const http_status_codes_1 = require("http-status-codes");
const stripe_1 = __importDefault(require("stripe"));
const user_1 = __importDefault(require("../../models/user"));
const subscription_1 = __importDefault(require("../../models/subscription"));
const plan_1 = __importDefault(require("../../models/plan"));
const stripe = new stripe_1.default((_a = process.env.STRIPE_SECRET_KEY) !== null && _a !== void 0 ? _a : '', { apiVersion: "2022-11-15" });
const createCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { number, exp_month, exp_year, cvc } = req.body;
    const { id } = res.locals.payload;
    const user = yield user_1.default.findOne({ where: { id } });
    if (!user) {
        return next({
            status: http_status_codes_1.StatusCodes.NOT_FOUND,
            message: "User not found"
        });
    }
    const email = user === null || user === void 0 ? void 0 : user.dataValues.email;
    const name = user === null || user === void 0 ? void 0 : user.dataValues.name;
    const customer = (user === null || user === void 0 ? void 0 : user.dataValues.stripe_customer_id) ? yield stripe.customers.retrieve(user === null || user === void 0 ? void 0 : user.dataValues.stripe_customer_id) : yield stripe.customers.create({
        email,
        name,
        description: '',
    });
    const customerData = customer;
    if (customerData.invoice_settings.default_payment_method) {
        yield stripe.paymentMethods.detach(`${customerData.invoice_settings.default_payment_method}`);
    }
    const payment_method = yield stripe.paymentMethods.create({
        type: 'card',
        card: {
            number: number,
            exp_month: exp_month,
            exp_year: exp_year,
            cvc: cvc,
        },
    });
    yield stripe.setupIntents.create({
        payment_method_types: ['card'],
        confirm: true,
        customer: customerData.id,
        payment_method: payment_method.id,
    });
    yield stripe.customers.update(customerData.id, { invoice_settings: { default_payment_method: payment_method.id } });
    if (!(user === null || user === void 0 ? void 0 : user.dataValues.stripe_customer_id)) {
        yield user_1.default.update({ stripe_customer_id: customer.id }, { where: { id: id } });
    }
    res.status(http_status_codes_1.StatusCodes.OK).json("OK");
});
exports.createCustomer = createCustomer;
const getCustomerInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id } = res.locals.payload;
    const user = yield user_1.default.findOne({ where: { id }, include: [subscription_1.default, plan_1.default] });
    let payment_methods = null;
    if (user === null || user === void 0 ? void 0 : user.dataValues.stripe_customer_id) {
        payment_methods = yield stripe.customers.listPaymentMethods((_b = user === null || user === void 0 ? void 0 : user.dataValues) === null || _b === void 0 ? void 0 : _b.stripe_customer_id, { type: 'card' });
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ user, plan: user === null || user === void 0 ? void 0 : user.dataValues.Plan, payment_methods });
});
exports.getCustomerInfo = getCustomerInfo;
const subscribePlan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const { product_id, plan_id } = req.body;
    const { id } = res.locals.payload;
    const user = yield user_1.default.findOne({ where: { id }, include: subscription_1.default });
    if ((_e = (_d = (_c = user === null || user === void 0 ? void 0 : user.dataValues) === null || _c === void 0 ? void 0 : _c.Subscription) === null || _d === void 0 ? void 0 : _d.dataValues) === null || _e === void 0 ? void 0 : _e.stripe_subscription_id) {
        yield stripe.subscriptions.del((_h = (_g = (_f = user === null || user === void 0 ? void 0 : user.dataValues) === null || _f === void 0 ? void 0 : _f.Subscription) === null || _g === void 0 ? void 0 : _g.dataValues) === null || _h === void 0 ? void 0 : _h.stripe_subscription_id);
        yield subscription_1.default.destroy({ where: { id: (_l = (_k = (_j = user === null || user === void 0 ? void 0 : user.dataValues) === null || _j === void 0 ? void 0 : _j.Subscription) === null || _k === void 0 ? void 0 : _k.dataValues) === null || _l === void 0 ? void 0 : _l.id } });
        yield user_1.default.update({
            current_plan_id: 1
        }, { where: { id: user.dataValues.id } });
    }
    const product = yield stripe.products.retrieve(product_id);
    if (!product) {
        return next({
            status: http_status_codes_1.StatusCodes.NOT_FOUND,
            message: "Plan is not defined"
        });
    }
    if (!(user === null || user === void 0 ? void 0 : user.dataValues.stripe_customer_id)) {
        return next({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: "You should add your payment method first"
        });
    }
    const subscription = yield stripe.subscriptions.create({
        customer: user === null || user === void 0 ? void 0 : user.dataValues.stripe_customer_id,
        items: [
            { price: `${product.default_price}` },
        ],
    });
    yield subscription_1.default.create({
        user_id: user === null || user === void 0 ? void 0 : user.dataValues.id,
        plan_id: product.id,
        stripe_subscription_id: subscription.id,
        start_date: new Date(subscription.start_date),
        end_date: subscription.ended_at,
        trial_period_start: null,
        trial_period_end: null
    });
    yield user_1.default.update({
        current_plan_id: plan_id
    }, { where: { id: user.dataValues.id } });
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.subscribePlan = subscribePlan;
const cancelSubScription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o, _p, _q, _r, _s, _t, _u;
    const { id } = res.locals.payload;
    const user = yield user_1.default.findOne({ where: { id }, include: subscription_1.default });
    if (!((_o = (_m = user === null || user === void 0 ? void 0 : user.dataValues.Subscription) === null || _m === void 0 ? void 0 : _m.dataValues) === null || _o === void 0 ? void 0 : _o.stripe_subscription_id)) {
        return next({
            status: http_status_codes_1.StatusCodes.NOT_FOUND,
            message: "Subscription is not defined"
        });
    }
    yield stripe.subscriptions.del((_r = (_q = (_p = user === null || user === void 0 ? void 0 : user.dataValues) === null || _p === void 0 ? void 0 : _p.Subscription) === null || _q === void 0 ? void 0 : _q.dataValues) === null || _r === void 0 ? void 0 : _r.stripe_subscription_id);
    yield subscription_1.default.destroy({ where: { id: (_u = (_t = (_s = user === null || user === void 0 ? void 0 : user.dataValues) === null || _s === void 0 ? void 0 : _s.Subscription) === null || _t === void 0 ? void 0 : _t.dataValues) === null || _u === void 0 ? void 0 : _u.id } });
    yield user_1.default.update({
        current_plan_id: 1
    }, { where: { id: user.dataValues.id } });
    const updateUser = yield user_1.default.findOne({ where: { id }, include: [plan_1.default, subscription_1.default] });
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: updateUser });
});
exports.cancelSubScription = cancelSubScription;
const getSubsciptionPlans = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const plans = yield plan_1.default.findAll({ order: [['price', "ASC"]] });
    res.status(http_status_codes_1.StatusCodes.OK).json({ plans });
});
exports.getSubsciptionPlans = getSubsciptionPlans;
const stripeCheckoutSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _v, _w, _x;
    const { price_id, success_url, cancel_url, plan_id } = req.body;
    const { id } = res.locals.payload;
    if (!price_id || !success_url || !cancel_url || !plan_id) {
        return next({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: "Some required fields are missing"
        });
    }
    const user = yield user_1.default.findOne({ where: { id }, include: [subscription_1.default, plan_1.default] });
    const currentSubScription = (_x = (_w = (_v = user === null || user === void 0 ? void 0 : user.dataValues) === null || _v === void 0 ? void 0 : _v.Subscription) === null || _w === void 0 ? void 0 : _w.dataValues) === null || _x === void 0 ? void 0 : _x.stripe_subscription_id;
    if (currentSubScription) {
        yield stripe.subscriptions.del(currentSubScription);
        yield subscription_1.default.destroy({ where: { user_id: id } });
    }
    const product = yield stripe.products.retrieve(price_id);
    if (!product) {
        return next({
            status: http_status_codes_1.StatusCodes.NOT_FOUND,
            message: "Plan is not defined"
        });
    }
    const session = yield stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
            {
                price: `${product.default_price}`,
                quantity: 1,
            },
        ],
        success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancel_url,
    });
    yield subscription_1.default.create({ user_id: id, plan_id: plan_id, stripe_product_id: price_id, stripe_subscription_id: null });
    res.status(http_status_codes_1.StatusCodes.OK).json({ session });
});
exports.stripeCheckoutSession = stripeCheckoutSession;
const handleSuccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { session_id } = req.body;
    const { id } = res.locals.payload;
    const session = yield stripe.checkout.sessions.retrieve(session_id);
    const customer_id = session.customer;
    const subscription_id = session.subscription;
    const invoice_id = session.invoice;
    yield subscription_1.default.update({ stripe_subscription_id: subscription_id }, { where: { user_id: id } });
    const subscription = yield subscription_1.default.findOne({ where: { user_id: id } });
    yield user_1.default.update({ stripe_customer_id: customer_id, current_plan_id: subscription === null || subscription === void 0 ? void 0 : subscription.dataValues.plan_id }, { where: { id } });
    const user = yield user_1.default.findOne({ where: { id: id }, include: [subscription_1.default, plan_1.default] });
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.handleSuccess = handleSuccess;
const webhook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let data;
    let eventType;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
        let event;
        let signature = req.headers["stripe-signature"];
        try {
            event = stripe.webhooks.constructEvent(req.body, signature !== null && signature !== void 0 ? signature : '', webhookSecret);
        }
        catch (err) {
            return res.sendStatus(400);
        }
        data = event.data;
        eventType = event.type;
    }
    else {
        data = req.body.data;
        eventType = req.body.type;
    }
    switch (eventType) {
        case 'checkout.session.completed':
            console.log(data);
            break;
        case 'invoice.paid':
            console.log(data);
            break;
        case 'invoice.payment_failed':
            console.log(data);
            break;
        default:
    }
    res.sendStatus(http_status_codes_1.StatusCodes.OK).json();
});
exports.webhook = webhook;
//# sourceMappingURL=subscription.controller.js.map