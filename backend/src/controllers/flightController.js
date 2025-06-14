const flightService = require("../services/flightService");

/**
 * Handles flight search requests.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 */
const search = async (req, res) => {
  const { departureAirport, arrivalAirport, departureDate, seatClass } =
    req.query;

  if (!departureAirport || !arrivalAirport || !departureDate || !seatClass) {
    return res.status(400).json({
      message:
        "Missing required search parameters. Please provide departureAirport, arrivalAirport, departureDate, and seatClass.",
    });
  }

  try {
    const flights = await flightService.searchFlights(req.query);
    res.status(200).json(flights);
  } catch (error) {
    console.error("Flight Search Controller Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while searching for flights." });
  }
};

/**
 * Handles the request to get the list of all airports.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 */
const getAirports = async (req, res) => {
  try {
    const airports = await flightService.getAirportList();
    res.status(200).json(airports);
  } catch (error) {
    console.error("Get Airports Controller Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the airport list." });
  }
};

module.exports = {
  search,
  getAirports,
};
