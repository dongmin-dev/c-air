import axios from "axios";

const API_URL = "http://localhost:5001/api/flights";

/**
 * Searches for flights by sending a GET request to the backend.
 * @param {object} params The search parameters.
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

/**
 * Fetches the distinct list of all airports.
 * @returns {Promise<Array>} A promise that resolves to an array of airport codes.
 */
const getAirports = async () => {
  try {
    const response = await axios.get(`${API_URL}/airports`);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch airports:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Airport fetch failed");
  }
};

const flightService = {
  searchFlights,
  getAirports, // Add the new function to the exports
};

export default flightService;
