const Booking = require("../models/BookingModel");
const Class = require("../models/ClassModel");
const { getSubscription } = require("../stripe-utils/getSubscription");
const getBooking = async (req, res) => {
  try {
    const Bookings = await Booking.find({ user: req.user._id }).populate(
      "class"
    );

    const customerSubscription = await getSubscription(req.user.stripeId);
    if (customerSubscription.data <= 0) {
      res.status(400);
      throw new Error("Passwords dont match");
    }

    res.status(200).json(Bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addBooking = async (req, res) => {
  try {
    const exerciseClass = await Class.findById(req.body.classId);

    if (!exerciseClass) {
      throw new Error("Class dosent exist");
    }

    if (exerciseClass.numberofspaces === 0) {
      throw new Error("No places avaliable");
    }

    const hasBooking = await Booking.findOne({
      user: req.user._id,
      class: req.body.classId,
    });

    if (hasBooking) {
      throw new Error("You already have booked this class");
    }

    const customerSubscription = await getSubscription(req.user.stripeId);

    if (customerSubscription.pause_collection) {
      throw new Error("Please resume your plan");
    }

    if (
      customerSubscription.plan.product.name == "Premium plan" ||
      customerSubscription.plan.product.name == "Gym Plan" ||
      customerSubscription.plan.product.name == exerciseClass.membershiptype
    ) {
      const customerBooking = new Booking({
        user: req.user._id,
        class: req.body.classId,
      });

      exerciseClass.numberofspaces -= 1;

      await exerciseClass.save();
      await customerBooking.save();
      res.status(200).json(customerBooking);
    } else {
      throw new Error(
        `You must a have ${exerciseClass.membershiptype} in order to book this class`
      );
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const exerciseClass = await Class.findById(req.body.classId);

    await Booking.findByIdAndDelete(req.params.bookingId);

    exerciseClass.numberofspaces += 1;

    exerciseClass.save();

    res.status(200).json({ message: "Booking canceled" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getBooking, addBooking, cancelBooking };
