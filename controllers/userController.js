const mongoose = require("mongoose");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
// This is your test secret API key.
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);
    const code = user.gymCode;
    const isAdmin = user.isAdmin;
    res.status(200).json({ name: user.name, email, token, code, isAdmin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    if (password != confirmPassword) {
      res.status(400);
      throw new Error("Passwords dont match");
    }

    const user = await User.signup(name, email, password);

    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
    });

    user.stripeId = customer.id;
    user.save();

    const token = createToken(user._id);

    const code = user.gymCode;
    const isAdmin = user.isAdmin;
    res.status(200).json({ name, email, token, code, isAdmin });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
};
