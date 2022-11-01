const mongoose = require("mongoose");
const bcrypy = require("bcryptjs");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: false,
    },
    gymCode: {
      type: Number,
      required: false,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// statis signup methpd

userSchema.statics.signup = async function (name, email, password) {
  if (!email || !password) {
    throw Error("All feilds must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (
    !validator.isStrongPassword(password, [
      { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 },
    ])
  ) {
    throw Error("Password not strong enough");
  }

  const exits = await this.findOne({ email });

  if (exits) {
    throw Error("Email already in use");
  }

  const salt = await bcrypy.genSalt(10);

  const hash = await bcrypy.hash(password, salt);

  const user = await this.create({ name, email, password: hash });

  return user;
};

// statis Login methpd

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All feilds must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect Email");
  }

  const match = await bcrypy.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
