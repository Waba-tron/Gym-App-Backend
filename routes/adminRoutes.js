const express = require("express");
const { getAllMemberships } = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/requireAuth");
const router = express.Router();

router.get("/all-subscriptions", requireAuth, requireAdmin, getAllMemberships);

module.exports = router;
