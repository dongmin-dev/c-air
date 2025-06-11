const db = require("./databaseService");
const emailService = require("./emailService");
const customerService = require("./customerService");

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

  // Fetch the full user object to get their name and email for the confirmation
  const user = await customerService.findByCno(booking.CNO);
  if (!user) {
    throw new Error("Associated user not found for cancellation.");
  }

  // --- 2. Start a Database Transaction ---
  const connection = await db.getConnectionForTransaction();
  try {
    // --- 3. Insert into CANCEL table ---
    const insertCancelSql = `
      INSERT INTO CANCEL (flightNo, departureDateTime, seatClass, refund, cancelDateTime, cno)
      VALUES (:flightNo, :departureDateTime, :seatClass, :refund, SYSTIMESTAMP, :cno)
    `;
    const insertBinds = {
      flightNo: booking.FLIGHTNO,
      departureDateTime: new Date(booking.DEPARTUREDATETIME),
      seatClass: booking.SEATCLASS,
      refund: refundAmount,
      cno: booking.CNO,
    };
    await connection.execute(insertCancelSql, insertBinds);

    // --- 4. Delete from RESERVE table ---
    const deleteReserveSql = `
      DELETE FROM RESERVE
      WHERE flightNo = :flightNo
      AND departureDateTime = :departureDateTime
      AND seatClass = :seatClass
      AND cno = :cno
    `;
    const deleteBinds = {
      flightNo: booking.FLIGHTNO,
      departureDateTime: new Date(booking.DEPARTUREDATETIME),
      seatClass: booking.SEATCLASS,
      cno: booking.CNO,
    };
    await connection.execute(deleteReserveSql, deleteBinds);

    // --- 5. Commit the transaction ---
    await connection.commit();

    // --- 6. Send confirmation email after successful transaction ---
    emailService.sendCancellationConfirmation(user, booking, refundAmount);

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
      AND TO_CHAR(r.departureDateTime, 'YYYY-MM-DD"T"HH24:MI:SS') = SUBSTR(:departureDateTime, 1, 19)
      AND r.seatClass = :seatClass
      AND r.cno = :cno
    `;
  const binds = {
    flightNo,
    departureDateTime,
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
