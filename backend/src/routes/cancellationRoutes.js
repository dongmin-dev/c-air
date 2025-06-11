const express = require("express");
const router = express.Router();

const cancellationController = require("../controllers/cancellationController");

// Define the route to get details for the cancellation confirmation page
// e.g., GET /api/cancellations/details?flightNo=KE081&...
router.get("/details", cancellationController.getCancellationDetails);

// Define the route to process the final cancellation
// e.g., POST /api/cancellations/
router.post("/", cancellationController.create);

module.exports = router;
