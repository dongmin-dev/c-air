const db = require("./databaseService");

/**
 * Fetches booking statistics, grouped by Airline and Seat Class with subtotals.
 * Uses the CUBE function.
 * @returns {Promise<Array>}
 */
const getBookingSummaryStats = async () => {
  const sql = `
    SELECT 
      a.AIRLINE, 
      r.SEATCLASS, 
      COUNT(*) AS TOTAL_BOOKINGS, 
      SUM(r.PAYMENT) AS TOTAL_REVENUE
    FROM RESERVE r
    JOIN AIRPLANE a ON r.FLIGHTNO = a.FLIGHTNO AND r.DEPARTUREDATETIME = a.DEPARTUREDATETIME
    GROUP BY CUBE(a.AIRLINE, r.SEATCLASS)
    ORDER BY a.AIRLINE, r.SEATCLASS
  `;
  const result = await db.execute(sql);
  return result.rows;
};

/**
 * Fetches customer spending statistics, ranked by total payment.
 * Uses a window function RANK() OVER(...).
 * @returns {Promise<Array>}
 */
const getCustomerRanking = async () => {
  const sql = `
    SELECT 
      RANK() OVER (ORDER BY TOTAL_SPENT DESC) AS CUSTOMER_RANK,
      c.CNO,
      c.NAME,
      c.EMAIL,
      s.BOOKING_COUNT,
      s.TOTAL_SPENT
    FROM CUSTOMER c
    JOIN (
      SELECT
        CNO,
        COUNT(*) AS BOOKING_COUNT,
        SUM(PAYMENT) AS TOTAL_SPENT
      FROM RESERVE
      GROUP BY CNO
    ) s ON c.CNO = s.CNO
    ORDER BY CUSTOMER_RANK ASC
  `;
  const result = await db.execute(sql);
  return result.rows;
};

module.exports = {
  getBookingSummaryStats, // Renamed for clarity
  getCustomerRanking,
};
