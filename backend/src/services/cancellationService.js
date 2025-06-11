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

  const diffTime =
    departureDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let cancellationFee = 0;
  if (diffDays >= 15) {
    cancellationFee = 150000;
  } else if (diffDays >= 4) {
    cancellationFee = 180000;
  } else if (diffDays >= 1) {
    cancellationFee = 250000;
  } else {
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
    const binds = {
      flightNo: booking.FLIGHTNO,
      departureDateTime: new Date(booking.DEPARTUREDATETIME), // Using Date object
      seatClass: booking.SEATCLASS,
      refund: refundAmount,
      cno: booking.CNO,
    };
    await connection.execute(insertCancelSql, binds);

    // --- 4. Delete from RESERVE table ---
    const deleteReserveSql = `
      DELETE FROM RESERVE
      WHERE flightNo = :flightNo
      AND departureDateTime = :departureDateTime
      AND seatClass = :seatClass
      AND cno = :cno
    `;
    await connection.execute(deleteReserveSql, binds);

    // --- 5. Commit the transaction ---
    await connection.commit();

    return { success: true, message: "Cancellation successful." };
  } catch (error) {
    await connection.rollback();
    console.error("Error creating cancellation:", error);
    throw new Error("An error occurred during cancellation.");
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

/**
 * Fetches the full details of a single reservation to be displayed on the cancellation confirmation page.
 * @param {string} flightNo
 * @param {string} departureDateTime - The date string from the URL.
 * @param {string} seatClass
 * @param {string} cno
 * @returns {Promise<object>} The full booking record.
 */
const getBookingDetails = async (
  flightNo,
  departureDateTime,
  seatClass,
  cno
) => {
  const sql = `
      SELECT r.CNO, r.PAYMENT, r.RESERVEDATETIME,
             a.AIRLINE, a.FLIGHTNO, a.DEPARTUREDATETIME, a.DEPARTUREAIRPORT, 
             a.arrivalDateTime as ARRIVALDATETIME, a.ARRIVALAIRPORT, r.SEATCLASS
      FROM RESERVE r
      JOIN AIRPLANE a ON r.flightNo = a.flightNo AND r.departureDateTime = a.departureDateTime
      WHERE r.flightNo = :flightNo
      AND r.departureDateTime = :departureDateTime
      AND r.seatClass = :seatClass
      AND r.cno = :cno
    `;
  const binds = {
    flightNo,
    departureDateTime: new Date(departureDateTime), // Using Date object
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
