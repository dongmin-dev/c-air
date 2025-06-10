// Load environment variables from a .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/database");

// --- Import Routes ---
const authRoutes = require("./routes/authRoutes");
// We will add other routes here later.
// const flightRoutes = require('./routes/flightRoutes');

const app = express();

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Routes ===
// A simple test route to make sure the server is up and running
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the CNU Airline Reservation System API!" });
});

// Register the authentication routes
app.use("/api/auth", authRoutes);

// We will add the application's main routes here later. For example:
// app.use('/api/flights', flightRoutes);

// === Server Initialization ===
const PORT = process.env.PORT || 5000;

async function startup() {
  try {
    console.log("Starting server...");
    await db.initialize();
    await db.testConnection();

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
