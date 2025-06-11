import axios from "axios";

const API_URL = "http://localhost:5001/api/cancellations";

/**
 * Processes a flight cancellation by sending the original booking object.
 * @param {object} booking The full booking object to be canceled.
 * @returns {Promise<object>} The success response data from the server.
 */
const createCancellation = async (booking) => {
  try {
    const payload = { booking };
    const response = await axios.post(API_URL, payload);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to create cancellation:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Cancellation failed");
  }
};

const cancellationService = {
  createCancellation,
};

export default cancellationService;
