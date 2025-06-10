import axios from "axios";

// The base URL of our backend API
const API_URL = "http://localhost:5001/api/auth";

/**
 * Sends a login request to the backend.
 * @param {string} cno The customer number.
 * @param {string} passwd The user's password.
 * @returns {Promise<object>} The response data from the server, including user info.
 */
const login = async (cno, passwd) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      cno,
      passwd,
    });
    // If login is successful, the backend sends back user data.
    // We can store this data, for example, in localStorage to keep the user logged in.
    if (response.data && response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    // Axios wraps the error from the backend in error.response
    console.error(
      "Login failed:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : new Error("Login failed");
  }
};

const authService = {
  login,
};

export default authService;
