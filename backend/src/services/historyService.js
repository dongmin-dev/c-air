const db = require("./databaseService");

const getBookingHistory = async (cno, startDate, endDate) => {
  // The query has been simplified to remove the join to the CANCEL table.
  const sql = `
    SELECT
      r.CNO,
      r.RESERVEDATETIME,
      r.PAYMENT,
      a.AIRLINE,
      a.FLIGHTNO,
      a.DEPARTUREDATETIME,
      a.DEPARTUREAIRPORT,
      a.arrivalDateTime AS ARRIVALDATETIME,
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

// The getCancellationHistory function remains the same
const getCancellationHistory = async (cno, startDate, endDate) => {
  const sql = `
    SELECT
      c.CANCELDATETIME,
      c.REFUND,
      a.AIRLINE,
      a.FLIGHTNO,
      a.DEPARTUREDATETIME,
      a.DEPARTUREAIRPORT,
      a.arrivalDateTime AS ARRIVALDATETIME,
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
