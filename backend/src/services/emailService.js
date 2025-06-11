const nodemailer = require("nodemailer");

// 1. Create a transporter object using the configuration from .env
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports like 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a booking confirmation email.
 * @param {object} user The user object (containing NAME, EMAIL).
 * @param {object} flight The flight details object.
 */
const sendBookingConfirmation = async (user, flight) => {
  const mailOptions = {
    from: `"CNU Airline" <${process.env.EMAIL_USER}>`,
    to: user.EMAIL,
    subject: `[CNU Airline] Flight Booking Confirmation - ${flight.FLIGHTNO}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Booking Confirmation</h2>
        <p>Dear ${user.NAME},</p>
        <p>Your flight reservation with CNU Airline has been successfully confirmed. Please find your e-ticket details below.</p>
        <hr>
        <h3>Flight Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Airline</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${
              flight.AIRLINE
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Flight Number</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${
              flight.FLIGHTNO
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Departure</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${
              flight.DEPARTUREAIRPORT
            } at ${new Date(flight.DEPARTUREDATETIME).toLocaleString(
      "en-US"
    )}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Arrival</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${
              flight.ARRIVALAIRPORT
            } at ${new Date(flight.ARRIVALDATETIME).toLocaleString(
      "en-US"
    )}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Class</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${
              flight.SEATCLASS
            }</td>
          </tr>
           <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Amount Paid</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${new Intl.NumberFormat(
              "ko-KR",
              { style: "currency", currency: "KRW" }
            ).format(flight.PRICE)}</td>
          </tr>
        </table>
        <hr>
        <p>Thank you for choosing CNU Airline.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    // In a real app, you might want to handle this failure, but for now, we just log it.
  }
};

module.exports = {
  sendBookingConfirmation,
};
