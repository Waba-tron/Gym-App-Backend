const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const classRoutes = require("./routes/classRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// This is your test secret API key.
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// api routes
app.use("/api/user", userRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>");
});
