const db = require("./databaseService");
const emailService = require("./emailService");

/**
 * Creates a new flight reservation.
 * @param {object} user - The user object performing the booking.
 * @param {object} flight - The flight details to be booked.
 * @returns {Promise<object>} A success or error message.
 */
const createBooking = async (user, flight) => {
  // --- 1. Check for Seat Availability ---
  const availabilitySql = `
    SELECT (s.NO_OF_SEATS - NVL(r.RESERVED_COUNT, 0)) AS REMAINING_SEATS
    FROM SEATS s
    LEFT JOIN (
      SELECT FLIGHTNO, DEPARTUREDATETIME, SEATCLASS, COUNT(*) AS RESERVED_COUNT
      FROM RESERVE
      GROUP BY FLIGHTNO, DEPARTUREDATETIME, SEATCLASS
    ) r ON s.FLIGHTNO = r.FLIGHTNO AND s.DEPARTUREDATETIME = r.DEPARTUREDATETIME AND s.SEATCLASS = r.SEATCLASS
    WHERE s.FLIGHTNO = :flightNo
      AND s.DEPARTUREDATETIME = TO_TIMESTAMP(:departureDateTime, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"')
      AND s.SEATCLASS = :seatClass
  `;
  const availabilityBinds = {
    flightNo: flight.FLIGHTNO,
    departureDateTime: flight.DEPARTUREDATETIME,
    seatClass: flight.SEATCLASS,
  };
  const availabilityResult = await db.execute(
    availabilitySql,
    availabilityBinds
  );

  if (
    availabilityResult.rows.length === 0 ||
    availabilityResult.rows[0].REMAINING_SEATS <= 0
  ) {
    throw new Error("No available seats for this flight.");
  }

  // --- 2. Insert the new reservation into the database ---
  const insertSql = `
    INSERT INTO RESERVE (flightNo, departureDateTime, seatClass, payment, reserveDateTime, cno)
    VALUES (
      :flightNo, 
      TO_TIMESTAMP(:departureDateTime, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"'), 
      :seatClass, 
      :payment, 
      SYSTIMESTAMP, 
      :cno
    )
  `;
  const insertBinds = {
    flightNo: flight.FLIGHTNO,
    departureDateTime: flight.DEPARTUREDATETIME,
    seatClass: flight.SEATCLASS,
    payment: flight.PRICE,
    cno: user.CNO,
  };

  // We need to set autoCommit to true for INSERT statements with the oracledb driver
  const options = { autoCommit: true };

  try {
    await db.execute(insertSql, insertBinds, options);

    // --- 3. Send confirmation email after successful insertion ---
    // This runs in the background and does not block the API response
    emailService.sendBookingConfirmation(user, flight);

    return { success: true, message: "Booking successful!" };
  } catch (error) {
    // Check for a unique constraint violation error (user already booked this flight)
    if (error.errorNum && error.errorNum === 1) {
      throw new Error("You have already booked this flight.");
    }
    console.error("Error creating booking:", error);
    throw error;
  }
};

module.exports = {
  createBooking,
};
