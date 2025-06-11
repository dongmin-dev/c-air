const historyService = require("../services/historyService");

/**
 * Fetches both booking and cancellation history for a user.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 */
const getHistory = async (req, res) => {
  // The customer number will be a URL parameter, e.g., /api/history/c1
  const { cno } = req.params;
  // The date range will be query parameters, e.g., ?startDate=...&endDate=...
  const { startDate, endDate } = req.query;

  // Basic validation
  if (!cno || !startDate || !endDate) {
    return res
      .status(400)
      .json({
        message: "Customer number (cno), startDate, and endDate are required.",
      });
  }

  try {
    // Fetch both histories in parallel for efficiency
    const [bookings, cancellations] = await Promise.all([
      historyService.getBookingHistory(cno, startDate, endDate),
      historyService.getCancellationHistory(cno, startDate, endDate),
    ]);

    // Send both lists back in a single response object
    res.status(200).json({ bookings, cancellations });
  } catch (error) {
    console.error("History Controller Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching history." });
  }
};

module.exports = {
  getHistory,
};
