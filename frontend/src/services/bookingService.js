import axios from "axios";

const API_URL = "http://localhost:5001/api/bookings";

/**
 * Creates a new booking by sending a POST request to the backend.
 * @param {object} flight The flight object to be booked.
 * @param {object} user The currently logged-in user object.
 * @returns {Promise<object>} The success response data from the server.
 */
const createBooking = async (flight, user) => {
  try {
    // The request body must match what the backend controller expects: { flight, cno }
    const payload = {
      flight: flight,
      cno: user.cno, // Corrected from user.CNO to user.cno
    };
    const response = await axios.post(API_URL, payload);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to create booking:",
      error.response ? error.response.data : error.message
    );
    // Re-throw the error so the component can catch it and display a message
    throw error.response
      ? error.response.data
      : new Error("Booking creation failed");
  }
};

const bookingService = {
  createBooking,
};

export default bookingService;
