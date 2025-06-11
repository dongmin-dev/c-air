const db = require("./databaseService");

/**
 * Processes a flight cancellation.
 * @param {object} booking The original booking object to be canceled.
 * @returns {Promise<object>} A success or error message.
 */
const createCancellation = async (booking) => {
  // --- 1. Calculate Cancellation Fee ---
  const departureDate = new Date(booking.DEPARTUREDATETIME);
  const today = new Date(); // Use current date for calculation

  // Calculate the difference in days (ignoring time)
  const diffTime =
    departureDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let cancellationFee = 0;
  if (diffDays >= 15) {
    cancellationFee = 150000;
  } else if (diffDays >= 4) {
    cancellationFee = 180000;
  } else if (diffDays >= 1) {
    // 1, 2, or 3 days before
    cancellationFee = 250000;
  } else {
    // Day of departure or past
    cancellationFee = booking.PAYMENT;
  }

  const refundAmount = booking.PAYMENT - cancellationFee;

  // --- 2. Start a Database Transaction ---
  const connection = await db.getConnectionForTransaction();
  try {
    // --- 3. Insert into CANCEL table ---
    const insertCancelSql = `
      INSERT INTO CANCEL (flightNo, departureDateTime, seatClass, refund, cancelDateTime, cno)
      VALUES (:flightNo, :departureDateTime, :seatClass, :refund, SYSTIMESTAMP, :cno)
    `;
    const cancelBinds = {
      flightNo: booking.FLIGHTNO,
      departureDateTime: new Date(booking.DEPARTUREDATETIME),
      seatClass: booking.SEATCLASS,
      refund: refundAmount,
      cno: booking.CNO,
    };
    await connection.execute(insertCancelSql, cancelBinds);

    // --- 4. Delete from RESERVE table ---
    const deleteReserveSql = `
      DELETE FROM RESERVE
      WHERE flightNo = :flightNo
      AND departureDateTime = :departureDateTime
      AND seatClass = :seatClass
      AND cno = :cno
    `;
    // Binds are the same, no need to redefine
    await connection.execute(deleteReserveSql, cancelBinds);

    // --- 5. Commit the transaction ---
    await connection.commit();

    return { success: true, message: "Cancellation successful." };
  } catch (error) {
    // If anything fails, roll back the transaction
    await connection.rollback();
    console.error("Error creating cancellation:", error);
    throw new Error("An error occurred during cancellation.");
  } finally {
    // Always release the connection
    if (connection) {
      await connection.close();
    }
  }
};

// We need a way to get a single booking's details to display on the confirmation page
const getBookingDetails = async (
  flightNo,
  departureDateTime,
  seatClass,
  cno
) => {
  const sql = `
      SELECT r.*, a.AIRLINE, a.DEPARTUREAIRPORT, a.arrivalDateTime as ARRIVALDATETIME, a.ARRIVALAIRPORT
      FROM RESERVE r
      JOIN AIRPLANE a ON r.flightNo = a.flightNo AND r.departureDateTime = a.departureDateTime
      WHERE r.flightNo = :flightNo
      AND r.departureDateTime = :departureDateTime
      AND r.seatClass = :seatClass
      AND r.cno = :cno
    `;
  const binds = {
    flightNo,
    departureDateTime: new Date(departureDateTime),
    seatClass,
    cno,
  };
  const result = await db.execute(sql, binds);
  return result.rows[0];
};

module.exports = {
  createCancellation,
  getBookingDetails,
};
