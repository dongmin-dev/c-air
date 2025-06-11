const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

// Define the route for creating a new booking
// A POST request to /api/bookings/ will be handled by the bookingController.create function.
router.post("/", bookingController.create);

module.exports = router;
