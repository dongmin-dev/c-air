import axios from "axios";

// The base URL of our backend API
const API_URL = "http://localhost:5001/api/flights";

/**
 * Searches for flights by sending a GET request to the backend.
 * @param {object} params The search parameters.
 * @param {string} params.departureAirport
 * @param {string} params.arrivalAirport
 * @param {string} params.departureDate
 * @param {string} params.seatClass
 * @returns {Promise<Array>} A promise that resolves to an array of flight objects.
 */
const searchFlights = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/search`, { params });
    return response.data;
  } catch (error) {
    console.error(
      "Failed to search flights:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Flight search failed");
  }
};

const flightService = {
  searchFlights,
};

export default flightService;
