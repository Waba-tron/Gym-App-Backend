const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    req.user = await User.findOne({ _id }).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized as an admin");
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { requireAuth, requireAdmin };
