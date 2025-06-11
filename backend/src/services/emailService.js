const nodemailer = require("nodemailer");
const path = require("path"); // Import the path module

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
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <img src="cid:logo" alt="C-AIR Logo" style="height: 30px; margin-bottom: 20px;" />
        <h2>Booking Confirmation</h2>
        <p>Dear ${user.NAME},</p>
        <p>Your flight reservation with CNU Airline has been successfully confirmed. Please find your e-ticket details below.</p>
        <hr>
        <h3>Flight Details</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
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
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>${new Intl.NumberFormat(
              "ko-KR",
              { style: "currency", currency: "KRW" }
            ).format(flight.PRICE)}</strong></td>
          </tr>
        </table>
        <hr>
        <p>Thank you for choosing CNU Airline.</p>
      </div>
    `,
    attachments: [
      {
        filename: "CAIR-Logo-blue.png",
        path: path.join(__dirname, "CAIR-Logo-blue.png"),
        cid: "logo", // same cid value as in the html img src
      },
    ],
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendCancellationConfirmation = async (user, booking, refundAmount) => {
  const mailOptions = {
    from: `"CNU Airline" <${process.env.EMAIL_USER}>`,
    to: user.EMAIL,
    subject: `[CNU Airline] Flight Cancellation Confirmation - ${booking.FLIGHTNO}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <img src="cid:logo" alt="C-AIR Logo" style="height: 30px; margin-bottom: 20px;" />
        <h2>Cancellation Confirmation</h2>
        <p>Dear ${user.NAME},</p>
        <p>This email confirms that your flight reservation has been successfully canceled. Please find the details below.</p>
        <hr>
        <h3>Canceled Flight Details</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Flight</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  booking.AIRLINE
                } ${booking.FLIGHTNO}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Route</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  booking.DEPARTUREAIRPORT
                } → ${booking.ARRIVALAIRPORT}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Departure</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${new Date(
                  booking.DEPARTUREDATETIME
                ).toLocaleString("en-US")}</td>
            </tr>
        </table>
        <br>
        <h3>Refund Details</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Original Payment</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${new Intl.NumberFormat(
              "ko-KR",
              { style: "currency", currency: "KRW" }
            ).format(booking.PAYMENT)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total Refund</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>${new Intl.NumberFormat(
              "ko-KR",
              { style: "currency", currency: "KRW" }
            ).format(refundAmount)}</strong></td>
          </tr>
        </table>
        <hr>
        <p>Thank you for choosing CNU Airline.</p>
      </div>
    `,
    attachments: [
      {
        filename: "CAIR-Logo-blue.png",
        path: path.join(__dirname, "CAIR-Logo-blue.png"),
        cid: "logo",
      },
    ],
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
  sendCancellationConfirmation,
};
