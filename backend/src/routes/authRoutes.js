const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Define the login route
// When a POST request is made to /api/auth/login, the authController.login function will be executed.
router.post("/login", authController.login);

module.exports = router;
