const express = require("express");
const {
  getClassesWideSearch,
  addClass,
  getClassById,
} = require("../controllers/classController");
const { requireAuth, requireAdmin } = require("../middleware/requireAuth");
const router = express.Router();

router.post("/", requireAuth, getClassesWideSearch);

router.get("/:id", requireAuth, getClassById);

router.post("/add-class", requireAuth, requireAdmin, addClass);

module.exports = router;
