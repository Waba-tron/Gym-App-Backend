// This is your test secret API key.
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const User = require("../models/UserModel");
const { getSubscription } = require("../stripe-utils/getSubscription");
const getProducts = async (req, res) => {
  try {
    const products = await stripe.products.search({
      query: "name:'plan'",
      expand: ["data.default_price"],
    });

    res.json(products);
  } catch (error) {
    res.json({ error: error });
  }
};

const getCustomerSubscription = async (req, res) => {
  try {
    const subscription = await getSubscription(req.user.stripeId);

    const user = await User.findById(req.user.id);

    //call user function to get gym code

    // add it to the state management

    //  console.log(await getSubscription(req.user.stripeId));

    /*
    const subscriptions = await stripe.subscriptions.list({
      customer: req.user.stripeId,
      expand: ["data.plan.product"],
    });

    if (subscriptions.data.length <= 0) {
      res.status(404);
      throw new Error("You do not have a subscription");
    }


    res.json(subscriptions.data[0]);
    */

    console.log(user.gymCode);
    res.json({ subscription, code: user.gymCode });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const buyCustomerSubscription = async (req, res) => {
  const YOUR_DOMAIN = "http://localhost:3000";

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: req.user.stripeId,
      expand: ["data.plan.product"],
    });

    if (subscriptions.data.length > 0) {
      res.status(409);
      throw new Error("You already have a membership");
    }

    const priceId = req.params.id;

    const session = await stripe.checkout.sessions.create({
      customer: req.user.stripeId,
      billing_address_collection: "auto",
      line_items: [
        {
          //   price: "price_1LXUc6Iq83axM2mAk9YYZd9t",
          // For metered billing, do not pass quantity
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${YOUR_DOMAIN}/account`,
      cancel_url: `${YOUR_DOMAIN}/pricing`,
    });

    /*
    const user = await User.findById(req.user._id);

    const code = nanoid();

    user.gymCode = code;

    user.save();
    */

    res.json({ url: session.url }); // <-- this is the changed line
  } catch (error) {
    res.json({ error: error.message });
  }

  /*
  try {
    const returnUrl = "http://localhost:3000/pricing";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: req.user.stripeId,
      return_url: returnUrl,
    });

    res.json({ url: portalSession.url }); // <-- this is the changed line
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  */
};

const manageCustomerSubscription = async (req, res) => {
  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.

  try {
    const returnUrl = "http://localhost:3000/account";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: req.user.stripeId,
      return_url: returnUrl,
    });

    res.json({ url: portalSession.url }); // <-- this is the changed line
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getCustomerSubscription,
  buyCustomerSubscription,
  manageCustomerSubscription,
};
