const mongoose = require("mongoose");
const bookingSchema = require("./BookingModel");
const target = mongoose.Schema({
  target: {
    type: String,
    required: true,
  },
});

const classSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    trainer: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    benefits: {
      type: [String],
      required: true,
    },
    numberofspaces: {
      type: Number,
      required: true,
      default: 15,
    },
    membershiptype: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Class", classSchema);
