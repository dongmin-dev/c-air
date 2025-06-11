const cancellationService = require("../services/cancellationService");

/**
 * Gets the full details of a single reservation to be displayed on the cancellation confirmation page.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 */
const getCancellationDetails = async (req, res) => {
  // All necessary details will be passed as query parameters
  const { flightNo, departureDateTime, seatClass, cno } = req.query;

  if (!flightNo || !departureDateTime || !seatClass || !cno) {
    return res
      .status(400)
      .json({
        message: "Missing required parameters to fetch booking details.",
      });
  }

  try {
    const bookingDetails = await cancellationService.getBookingDetails(
      flightNo,
      departureDateTime,
      seatClass,
      cno
    );
    if (!bookingDetails) {
      return res.status(404).json({ message: "Booking not found." });
    }
    res.status(200).json(bookingDetails);
  } catch (error) {
    console.error("Get Cancellation Details Controller Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching booking details." });
  }
};

/**
 * Processes a flight cancellation request.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 */
const create = async (req, res) => {
  // The full booking object, fetched on the confirmation page, will be in the request body
  const { booking } = req.body;

  if (!booking) {
    return res
      .status(400)
      .json({ message: "Booking information is required." });
  }

  try {
    const result = await cancellationService.createCancellation(booking);
    res.status(200).json(result); // 200 OK is appropriate as the resource is deleted/changed
  } catch (error) {
    console.error("Cancellation Controller Error:", error);
    res.status(500).json({ message: "An error occurred during cancellation." });
  }
};

module.exports = {
  getCancellationDetails,
  create,
};
