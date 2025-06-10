// Load environment variables from a .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// === Middleware ===
// Enable Cross-Origin Resource Sharing (CORS) so the frontend can communicate with this backend
app.use(cors());

// Enable the express app to parse JSON formatted request bodies
app.use(express.json());

// === Routes ===
// A simple test route to make sure the server is up and running
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the CNU Airline Reservation System API!" });
});

// We will add the application's main routes here later. For example:
// const authRoutes = require('./routes/authRoutes');
// const flightRoutes = require('./routes/flightRoutes');
// app.use('/api/auth', authRoutes);
// app.use('/api/flights', flightRoutes);

// === Server Initialization ===
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  // We will initialize the database connection here later
});
