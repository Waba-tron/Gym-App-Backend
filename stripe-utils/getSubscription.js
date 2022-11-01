const User = require("../models/UserModel");
const uuid = require("uuid");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890", 8);
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const getSubscription = async (stripeId) => {
  const subscription = await stripe.subscriptions.list({
    customer: stripeId,
    expand: ["data.plan.product"],
  });

  console.log(subscription);

  if (subscription.data.length <= 0) {
    throw new Error("You do not have a subscription");
  }

  const user = await User.findOne({ stripeId: stripeId });

  if (!user.gymCode) {
    user.gymCode = nanoid();
    user.save();
  }

  // console.log(subscription);

  return subscription.data[0];
};

module.exports = { getSubscription };
