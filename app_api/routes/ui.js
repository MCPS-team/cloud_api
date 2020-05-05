// Import modules
const express = require("express");
const router = express.Router();

// Import controllers
const ctrlUI = require("../controllers/frontend");

// Web UI pages
router.route("/dashboard").get(ctrlUI.getDashboard)
router.route("/map").get(ctrlUI.getMap)
router.route("/about").get(ctrlUI.getAbout);

module.exports = router;
