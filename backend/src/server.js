// Load environment variables from a .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/database"); // Import the database module

const app = express();

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Routes ===
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the CNU Airline Reservation System API!" });
});

// === Server Initialization ===
const PORT = process.env.PORT || 5000;

async function startup() {
  try {
    // Initialize the database
    await db.initialize();

    // Test the database connection
    await db.testConnection();

    // Start the web server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (err) {
    console.error("Error during server startup:", err);
    process.exit(1);
  }
}

startup();

// Gracefully close the database connection pool on exit
process.once("SIGTERM", db.close).once("SIGINT", db.close);
