const flightService = require("../services/flightService");

/**
 * Handles flight search requests.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 */
async function search(req, res) {
  // 1. Extract search parameters from the request query string
  const { departureAirport, arrivalAirport, departureDate, seatClass } =
    req.query;

  // 2. Basic validation to ensure all required parameters are present
  if (!departureAirport || !arrivalAirport || !departureDate || !seatClass) {
    return res.status(400).json({
      message:
        "Missing required search parameters. Please provide departureAirport, arrivalAirport, departureDate, and seatClass.",
    });
  }

  try {
    // 3. Call the service layer to perform the search
    const flights = await flightService.searchFlights({
      departureAirport,
      arrivalAirport,
      departureDate,
      seatClass,
    });

    // 4. Send the results back to the client
    res.status(200).json(flights);
  } catch (error) {
    // 5. Handle any unexpected errors from the service layer
    console.error("Flight Search Controller Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while searching for flights." });
  }
}

module.exports = {
  search,
};
