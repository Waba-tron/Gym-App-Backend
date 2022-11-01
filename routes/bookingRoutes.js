const express = require("express");
const {
  getBooking,
  addBooking,
  cancelBooking,
} = require("../controllers/bookingController");
const { requireAuth, requireAdmin } = require("../middleware/requireAuth");
const router = express.Router();

router.get("/", requireAuth, getBooking);

router.post("/add-booking", requireAuth, addBooking);

router.delete("/:bookingId", requireAuth, cancelBooking);

module.exports = router;
