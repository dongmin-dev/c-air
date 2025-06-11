const db = require("./databaseService");

/**
 * Searches for flights based on specified criteria.
 * @param {object} criteria The search criteria.
 * @param {string} criteria.departureAirport The 3-letter code for the departure airport.
 * @param {string} criteria.arrivalAirport The 3-letter code for the arrival airport.
 * @param {string} criteria.departureDate The departure date in 'YYYY-MM-DD' format.
 * @param {string} criteria.seatClass The desired seat class (e.g., 'ECONOMY', 'BUSINESS').
 * @returns {Promise<Array>} A list of flight objects matching the criteria.
 */
async function searchFlights({
  departureAirport,
  arrivalAirport,
  departureDate,
  seatClass,
}) {
  const sql = `
    SELECT
      a.AIRLINE,
      a.FLIGHTNO,
      a.DEPARTUREDATETIME,
      a.DEPARTUREAIRPORT,
      a.arrivalDateTime, -- Corrected from a.ARRIVEDATETIME
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
    ORDER BY s.PRICE ASC
  `;

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

module.exports = {
  searchFlights,
};
