const db = require("./databaseService");

/**
 * Fetches the booking history for a specific user within a date range.
 * @param {string} cno The customer number.
 * @param {string} startDate The start of the date range in 'YYYY-MM-DD' format.
 * @param {string} endDate The end of the date range in 'YYYY-MM-DD' format.
 * @returns {Promise<Array>} A list of booking history records.
 */
const getBookingHistory = async (cno, startDate, endDate) => {
  const sql = `
    SELECT
      r.RESERVEDATETIME,
      r.PAYMENT,
      a.AIRLINE,
      a.FLIGHTNO,
      a.DEPARTUREDATETIME,
      a.DEPARTUREAIRPORT,
      a.arrivalDateTime AS ARRIVALDATETIME, -- Alias to match other queries
      a.ARRIVALAIRPORT,
      r.SEATCLASS
    FROM RESERVE r
    JOIN AIRPLANE a ON r.FLIGHTNO = a.FLIGHTNO AND r.DEPARTUREDATETIME = a.DEPARTUREDATETIME
    WHERE r.CNO = :cno
      AND TRUNC(r.RESERVEDATETIME) BETWEEN TO_DATE(:startDate, 'YYYY-MM-DD') AND TO_DATE(:endDate, 'YYYY-MM-DD')
    ORDER BY r.RESERVEDATETIME DESC
  `;
  const binds = { cno, startDate, endDate };
  const result = await db.execute(sql, binds);
  return result.rows;
};

/**
 * Fetches the cancellation history for a specific user within a date range.
 * @param {string} cno The customer number.
 * @param {string} startDate The start of the date range in 'YYYY-MM-DD' format.
 * @param {string} endDate The end of the date range in 'YYYY-MM-DD' format.
 * @returns {Promise<Array>} A list of cancellation history records.
 */
const getCancellationHistory = async (cno, startDate, endDate) => {
  const sql = `
    SELECT
      c.CANCELDATETIME,
      c.REFUND,
      a.AIRLINE,
      a.FLIGHTNO,
      a.DEPARTUREDATETIME,
      a.DEPARTUREAIRPORT,
      a.arrivalDateTime AS ARRIVALDATETIME, -- Alias to match other queries
      a.ARRIVALAIRPORT,
      c.SEATCLASS
    FROM CANCEL c
    JOIN AIRPLANE a ON c.FLIGHTNO = a.FLIGHTNO AND c.DEPARTUREDATETIME = a.DEPARTUREDATETIME
    WHERE c.CNO = :cno
      AND TRUNC(c.CANCELDATETIME) BETWEEN TO_DATE(:startDate, 'YYYY-MM-DD') AND TO_DATE(:endDate, 'YYYY-MM-DD')
    ORDER BY c.CANCELDATETIME DESC
  `;
  const binds = { cno, startDate, endDate };
  const result = await db.execute(sql, binds);
  return result.rows;
};

module.exports = {
  getBookingHistory,
  getCancellationHistory,
};
