const db = require("./databaseService");

// createCancellation function remains the same
const createCancellation = async (booking) => {
  const departureDate = new Date(booking.DEPARTUREDATETIME);
  const today = new Date();
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
  const connection = await db.getConnectionForTransaction();
  try {
    const insertCancelSql = `
      INSERT INTO CANCEL (flightNo, departureDateTime, seatClass, refund, cancelDateTime, cno)
      VALUES (:flightNo, :departureDateTime, :seatClass, :refund, SYSTIMESTAMP, :cno)
    `;
    const binds = {
      flightNo: booking.FLIGHTNO,
      departureDateTime: new Date(booking.DEPARTUREDATETIME),
      seatClass: booking.SEATCLASS,
      refund: refundAmount,
      cno: booking.CNO,
    };
    await connection.execute(insertCancelSql, binds);
    const deleteReserveSql = `
      DELETE FROM RESERVE
      WHERE flightNo = :flightNo
      AND departureDateTime = :departureDateTime
      AND seatClass = :seatClass
      AND cno = :cno
    `;
    await connection.execute(deleteReserveSql, binds);
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
 * Fetches the full details of a single reservation.
 * THIS FUNCTION CONTAINS THE NEW FIX.
 */
const getBookingDetails = async (
  flightNo,
  departureDateTime,
  seatClass,
  cno
) => {
  // We convert the database TIMESTAMP into a specific string format for comparison.
  const sql = `
      SELECT r.CNO, r.PAYMENT, r.RESERVEDATETIME,
             a.AIRLINE, a.FLIGHTNO, a.DEPARTUREDATETIME, a.DEPARTUREAIRPORT, 
             a.arrivalDateTime as ARRIVALDATETIME, a.ARRIVALAIRPORT, r.SEATCLASS
      FROM RESERVE r
      JOIN AIRPLANE a ON r.flightNo = a.flightNo AND r.departureDateTime = a.departureDateTime
      WHERE r.flightNo = :flightNo
      -- This comparison is now string-to-string, which is more reliable
      AND TO_CHAR(r.departureDateTime, 'YYYY-MM-DD"T"HH24:MI:SS') = SUBSTR(:departureDateTime, 1, 19)
      AND r.seatClass = :seatClass
      AND r.cno = :cno
    `;

  // We bind the original string from the URL directly.
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
