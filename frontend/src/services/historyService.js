import axios from "axios";

const API_URL = "http://localhost:5001/api/history";

/**
 * Fetches booking and cancellation history for a specific user.
 * @param {string} cno The customer number.
 * @param {object} dateRange The date range with startDate and endDate.
 * @returns {Promise<object>} A promise that resolves to an object containing bookings and cancellations arrays.
 */
const getHistory = async (cno, dateRange) => {
  try {
    // Pass the dateRange object as the 'params' for the GET request.
    // Axios will format it into ?startDate=...&endDate=...
    const response = await axios.get(`${API_URL}/${cno}`, {
      params: dateRange,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch history:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Failed to fetch history");
  }
};

const historyService = {
  getHistory,
};

export default historyService;
