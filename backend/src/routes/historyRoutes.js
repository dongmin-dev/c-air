const express = require("express");
const router = express.Router();

const historyController = require("../controllers/historyController");

// Define the route for fetching user history.
// The ':cno' part is a URL parameter that will capture the customer number.
// e.g., a GET request to /api/history/c1 will be handled by this route.
router.get("/:cno", historyController.getHistory);

module.exports = router;
