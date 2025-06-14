const statsService = require("../services/statsService");

/**
 * Fetches all administrator statistics.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 */
const getAdminStats = async (req, res) => {
  try {
    // Fetch both sets of statistics in parallel for efficiency
    const [bookingSummary, customerRanking] = await Promise.all([
      // This function call has been corrected
      statsService.getBookingSummaryStats(),
      statsService.getCustomerRanking(),
    ]);

    // Send both lists back in a single response object
    res.status(200).json({ bookingSummary, customerRanking });
  } catch (error) {
    console.error("Admin Stats Controller Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching admin statistics." });
  }
};

module.exports = {
  getAdminStats,
};
