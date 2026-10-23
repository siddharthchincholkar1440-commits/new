const express = require("express");

const { getMe } = require("../controllers/usercontroller");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.get("/me", protect, getMe);

module.exports = router;
