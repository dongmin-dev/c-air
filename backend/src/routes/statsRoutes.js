const express = require("express");
const router = express.Router();

const statsController = require("../controllers/statsController");

// Define the route for fetching all admin statistics
// e.g., a GET request to /api/stats/ will be handled by this route.
router.get("/", statsController.getAdminStats);

module.exports = router;
