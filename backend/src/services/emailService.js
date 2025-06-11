const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmation = async (user, flight) => {
  const mailOptions = {
    from: `"CNU Airline" <${process.env.EMAIL_USER}>`,
    to: user.EMAIL,
    subject: `[CNU Airline] Flight Booking Confirmation - ${flight.FLIGHTNO}`,
    html: `... (html content remains the same) ...`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

/**
 * Sends a cancellation confirmation email.
 * @param {object} user The user object (containing NAME, EMAIL).
 * @param {object} booking The original booking details that were canceled.
 * @param {number} refundAmount The calculated refund amount.
 */
const sendCancellationConfirmation = async (user, booking, refundAmount) => {
  const mailOptions = {
    from: `"CNU Airline" <${process.env.EMAIL_USER}>`,
    to: user.EMAIL, // We need to fetch the user object to get their email
    subject: `[CNU Airline] Flight Cancellation Confirmation - ${booking.FLIGHTNO}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Cancellation Confirmation</h2>
        <p>Dear ${user.NAME},</p>
        <p>This email confirms that your flight reservation has been successfully canceled. Please find the details below.</p>
        <hr>
        <h3>Canceled Flight Details</h3>
        <p>
          <strong>Flight:</strong> ${booking.AIRLINE} ${booking.FLIGHTNO}<br>
          <strong>Route:</strong> ${booking.DEPARTUREAIRPORT} → ${
      booking.ARRIVALAIRPORT
    }<br>
          <strong>Departure:</strong> ${new Date(
            booking.DEPARTUREDATETIME
          ).toLocaleString("en-US")}
        </p>
        <h3>Refund Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Original Payment</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${new Intl.NumberFormat(
              "ko-KR",
              { style: "currency", currency: "KRW" }
            ).format(booking.PAYMENT)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total Refund</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${new Intl.NumberFormat(
              "ko-KR",
              { style: "currency", currency: "KRW" }
            ).format(refundAmount)}</td>
          </tr>
        </table>
        <hr>
        <p>Thank you for choosing CNU Airline.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Cancellation confirmation email sent:", info.response);
  } catch (error) {
    console.error("Error sending cancellation email:", error);
  }
};

module.exports = {
  sendBookingConfirmation,
  sendCancellationConfirmation, // Add the new function to the exports
};
