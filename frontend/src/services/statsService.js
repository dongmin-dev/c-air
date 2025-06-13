import axios from "axios";

const API_URL = "http://localhost:5001/api/stats";

/**
 * Fetches all administrator statistics.
 * @returns {Promise<object>} A promise that resolves to an object containing routeStats and customerRanking arrays.
 */
const getStats = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch admin stats:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Failed to fetch admin stats");
  }
};

const statsService = {
  getStats,
};

export default statsService;
