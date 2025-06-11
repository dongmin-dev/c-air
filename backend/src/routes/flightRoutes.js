const express = require("express");
const router = express.Router();

const flightController = require("../controllers/flightController");

// Define the flight search route
// When a GET request is made to /api/flights/search, the flightController.search function will be executed.
router.get("/search", flightController.search);

module.exports = router;
