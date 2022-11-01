// This is your test secret API key.
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const getAllMemberships = async (req, res) => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      expand: ["data.plan.product"],
    });

    subscriptions.data.map((membership) =>
      console.log(membership.plan.product.name)
    );

    res.status(200).json(subscriptions.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllMemberships };
