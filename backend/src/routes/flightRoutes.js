const express = require("express");
const router = express.Router();

const flightController = require("../controllers/flightController");

// Existing search route
router.get("/search", flightController.search);

// New route to get the list of airports
router.get("/airports", flightController.getAirports);

module.exports = router;
