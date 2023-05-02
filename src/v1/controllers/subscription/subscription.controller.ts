import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';
import User from '../../models/user';
import Subscription from '../../models/subscription';
import Plan from '../../models/plan';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: "2022-11-15" });

const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  const { number, exp_month, exp_year, cvc } = req.body;
  const { id } = res.locals.payload;
  const user = await User.findOne({where: {id}});
  if (!user) {
    return next({
      status: StatusCodes.NOT_FOUND,
      message: "User not found"
    })
  }
  const email = user?.dataValues.email;
  const name = user?.dataValues.name;
  const customer = user?.dataValues.stripe_customer_id ? await stripe.customers.retrieve(
    user?.dataValues.stripe_customer_id
  ) : await stripe.customers.create({
    email,
    name,
    description: '',
  });

  const customerData = customer as Stripe.Customer;

  if (customerData.invoice_settings.default_payment_method) {
    await stripe.paymentMethods.detach(
      `${customerData.invoice_settings.default_payment_method}`
    );
  }

  const payment_method = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: number,
      exp_month: exp_month,
      exp_year: exp_year,
      cvc: cvc,
    },
  });

  await stripe.setupIntents.create({
    payment_method_types: ['card'],
    confirm: true,
    customer: customerData.id,
    payment_method: payment_method.id,
  });

  await stripe.customers.update(
    customerData.id,
    {invoice_settings: {default_payment_method: payment_method.id}}
  );

  if (!user?.dataValues.stripe_customer_id) {
    await User.update({ stripe_customer_id: customer.id }, {where: { id: id }})
  }
  
  res.status(StatusCodes.OK).json("OK");
}

const getCustomerInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = res.locals.payload;
  const user = await User.findOne({where: { id }, include: [Subscription, Plan]});
  let payment_methods = null;
  if (user?.dataValues.stripe_customer_id) {
    payment_methods = await stripe.customers.listPaymentMethods(
      user?.dataValues?.stripe_customer_id,
      {type: 'card'}
    );
  }
  res.status(StatusCodes.OK).json({user, plan: user?.dataValues.Plan, payment_methods});
}

const subscribePlan = async (req: Request, res: Response, next: NextFunction) => {
  const { product_id, plan_id } = req.body;
  const { id } = res.locals.payload;
  const user = await User.findOne({where: { id }, include: Subscription});
  
  if (user?.dataValues?.Subscription?.dataValues?.stripe_subscription_id) {
    await stripe.subscriptions.del(      
      user?.dataValues?.Subscription?.dataValues?.stripe_subscription_id
    );
    await Subscription.destroy({ where: { id: user?.dataValues?.Subscription?.dataValues?.id } });
    await User.update(
      {
        current_plan_id: 1
      }, 
      { where: { id: user.dataValues.id } }
    )
  }

  const product = await stripe.products.retrieve(
    product_id
  );

  if (!product) {
    return next({
      status: StatusCodes.NOT_FOUND,
      message: "Plan is not defined"
    })
  }

  if (!user?.dataValues.stripe_customer_id) {
    return next({
      status: StatusCodes.BAD_REQUEST,
      message: "You should add your payment method first"
    })
  }
  const subscription = await stripe.subscriptions.create({
    customer: user?.dataValues.stripe_customer_id,
    items: [
      {price: `${product.default_price}`},
    ],
  });
  await Subscription.create({ 
    user_id: user?.dataValues.id, 
    plan_id: product.id,
    stripe_subscription_id: subscription.id,
    start_date: new Date(subscription.start_date), 
    end_date: subscription.ended_at, 
    trial_period_start: null, 
    trial_period_end: null
  });
  await User.update(
    {
      current_plan_id: plan_id
    }, 
    { where: { id: user.dataValues.id } }
  )
  res.status(StatusCodes.OK).json({user});
}

const cancelSubScription = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = res.locals.payload;
  const user = await User.findOne({where: { id }, include: Subscription});
  if (!user?.dataValues.Subscription?.dataValues?.stripe_subscription_id) {
    return next({
      status: StatusCodes.NOT_FOUND,
      message: "Subscription is not defined"
    })
  }
  await stripe.subscriptions.del(
    user?.dataValues?.Subscription?.dataValues?.stripe_subscription_id,
  );
  await Subscription.destroy({ where: { id: user?.dataValues?.Subscription?.dataValues?.id } });
  await User.update(
    {
      current_plan_id: 1
    }, 
    { where: { id: user.dataValues.id } }
  )
  const updateUser = await User.findOne({where: { id }, include: [Plan, Subscription]});
  res.status(StatusCodes.OK).json({user: updateUser});
}

const getSubsciptionPlans = async (req: Request, res: Response, next: NextFunction) => {
  const plans = await Plan.findAll({ order: [['price', "ASC"]] });
  res.status(StatusCodes.OK).json({plans});
}

const stripeCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
  const { price_id, success_url, cancel_url, plan_id } = req.body;
  const { id } = res.locals.payload;

  if (!price_id || !success_url || !cancel_url || !plan_id) {
    return next({
      status: StatusCodes.BAD_REQUEST,
      message: "Some required fields are missing"
    });
  } 

  const user = await User.findOne({where: { id }, include: [Subscription, Plan]});

  const currentSubScription = user?.dataValues?.Subscription?.dataValues?.stripe_subscription_id;
  if (currentSubScription) {
    await stripe.subscriptions.del(
      currentSubScription
    );
    await Subscription.destroy({ where: { user_id: id } });
  }

  const product = await stripe.products.retrieve(
    price_id
  );

  if (!product) {
    return next({
      status: StatusCodes.NOT_FOUND,
      message: "Plan is not defined"
    })
  }
  const session = await stripe.checkout.sessions.create({
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
  await Subscription.create({ user_id: id, plan_id: plan_id, stripe_product_id: price_id,  stripe_subscription_id: null });
  res.status(StatusCodes.OK).json({ session })
}

const handleSuccess = async (req: Request, res: Response, next: NextFunction) =>  {
  const { session_id } = req.body;
  const { id } = res.locals.payload;
  const session = await stripe.checkout.sessions.retrieve(
    session_id
  );
  const customer_id = session.customer;
  const subscription_id = session.subscription;
  const invoice_id = session.invoice;

  await Subscription.update({ stripe_subscription_id: subscription_id }, { where: { user_id: id } });
  const subscription = await Subscription.findOne({ where: { user_id: id } });
  await User.update({ stripe_customer_id: customer_id, current_plan_id: subscription?.dataValues.plan_id }, { where: { id } });
  const user = await User.findOne({ where: { id: id }, include: [Subscription, Plan] });

  res.status(StatusCodes.OK).json({user});
}

const webhook = async (req: Request, res: Response, next: NextFunction) =>  {
  let data;
  let eventType;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (webhookSecret) {
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature ?? '',
        webhookSecret
      );
    } catch (err) {
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
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

  res.sendStatus(StatusCodes.OK).json();
}

export { 
  createCustomer,
  subscribePlan,
  getCustomerInfo,
  getSubsciptionPlans,
  cancelSubScription,
  stripeCheckoutSession,
  webhook,
  handleSuccess
};