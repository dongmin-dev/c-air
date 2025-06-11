const bookingService = require("../services/bookingService");
const customerService = require("../services/customerService");

/**
 * Handles a new flight booking request.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 */
const create = async (req, res) => {
  // 1. Extract the flight and customer number from the request body
  const { flight, cno } = req.body;

  // 2. Validate the incoming data
  if (!flight || !cno) {
    return res
      .status(400)
      .json({
        message: "Flight details and customer number (cno) are required.",
      });
  }

  try {
    // 3. Fetch the full user details to get their name and email for the confirmation ticket
    const user = await customerService.findByCno(cno);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 4. Call the booking service to perform the reservation
    const result = await bookingService.createBooking(user, flight);

    // 5. Send a success response
    res.status(201).json(result); // 201 Created
  } catch (error) {
    console.error("Booking Controller Error:", error);
    // 6. Handle specific errors thrown by the service
    if (
      error.message === "No available seats for this flight." ||
      error.message === "You have already booked this flight."
    ) {
      // 409 Conflict is a good status code for a business logic failure like this
      return res.status(409).json({ message: error.message });
    }

    // Handle any other unexpected errors
    res
      .status(500)
      .json({ message: "An internal server error occurred during booking." });
  }
};

module.exports = {
  create,
};
