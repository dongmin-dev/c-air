const db = require("./databaseService");

/**
 * Searches for flights based on specified criteria.
 * @param {object} criteria The search criteria.
 * @param {string} criteria.departureAirport
 * @param {string} criteria.arrivalAirport
 * @param {string} criteria.departureDate
 * @param {string} criteria.seatClass
 * @param {string} [criteria.sortBy] - The sorting option ('price_asc' or 'time_asc').
 * @returns {Promise<Array>} A list of flight objects matching the criteria.
 */
async function searchFlights({
  departureAirport,
  arrivalAirport,
  departureDate,
  seatClass,
  sortBy,
}) {
  let sql = `
    SELECT
      a.AIRLINE,
      a.FLIGHTNO,
      a.DEPARTUREDATETIME,
      a.DEPARTUREAIRPORT,
      a.arrivalDateTime,
      a.ARRIVALAIRPORT,
      s.SEATCLASS,
      s.PRICE,
      (s.NO_OF_SEATS - NVL(r.RESERVED_COUNT, 0)) AS REMAINING_SEATS
    FROM AIRPLANE a
    JOIN SEATS s ON a.FLIGHTNO = s.FLIGHTNO AND a.DEPARTUREDATETIME = s.DEPARTUREDATETIME
    LEFT JOIN (
      SELECT FLIGHTNO, DEPARTUREDATETIME, SEATCLASS, COUNT(*) AS RESERVED_COUNT
      FROM RESERVE
      GROUP BY FLIGHTNO, DEPARTUREDATETIME, SEATCLASS
    ) r ON s.FLIGHTNO = r.FLIGHTNO AND s.DEPARTUREDATETIME = r.DEPARTUREDATETIME AND s.SEATCLASS = r.SEATCLASS
    WHERE 
      a.DEPARTUREAIRPORT = :departureAirport
      AND a.ARRIVALAIRPORT = :arrivalAirport
      AND TRUNC(a.DEPARTUREDATETIME) = TO_DATE(:departureDate, 'YYYY-MM-DD')
      AND s.SEATCLASS = :seatClass
      AND (s.NO_OF_SEATS - NVL(r.RESERVED_COUNT, 0)) > 0
  `;

  switch (sortBy) {
    case "time_asc":
      sql += ` ORDER BY a.DEPARTUREDATETIME ASC`;
      break;
    case "price_asc":
    default:
      sql += ` ORDER BY s.PRICE ASC`;
      break;
  }

  const binds = {
    departureAirport,
    arrivalAirport,
    departureDate,
    seatClass,
  };

  try {
    const result = await db.execute(sql, binds);
    return result.rows;
  } catch (err) {
    console.error("Error searching flights:", err);
    throw err;
  }
}

/**
 * Fetches a distinct list of all airport codes from the database.
 * @returns {Promise<Array>} A list of airport code objects.
 */
const getAirportList = async () => {
  const sql = `
    SELECT airport_code FROM (
      SELECT DEPARTUREAIRPORT AS airport_code FROM AIRPLANE
      UNION
      SELECT ARRIVALAIRPORT AS airport_code FROM AIRPLANE
    )
    ORDER BY airport_code ASC
  `;
  const result = await db.execute(sql);
  return result.rows.map((row) => row.AIRPORT_CODE);
};

module.exports = {
  searchFlights,
  getAirportList,
};
