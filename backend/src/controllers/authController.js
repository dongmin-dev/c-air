const customerService = require("../services/customerService");

/**
 * Handles the user login request.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 */
async function login(req, res) {
  // 1. Extract credentials from the request body
  const { cno, passwd } = req.body;

  // 2. Basic input validation
  if (!cno || !passwd) {
    return res
      .status(400)
      .json({ message: "Customer number (cno) and password are required." });
  }

  try {
    // 3. Find the user in the database using the service
    const customer = await customerService.findByCno(cno);

    // 4. Check if the user exists and if the password is correct
    if (!customer) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Invalid credentials." });
    }

    // --- IMPORTANT SECURITY NOTE ---
    // The current implementation compares plaintext passwords, which is highly insecure.
    // This is done ONLY to match the provided database schema.
    // In a real-world application, you should NEVER store plaintext passwords.
    // Instead, you should hash them using a library like 'bcrypt' during registration
    // and use 'bcrypt.compare()' here.
    if (customer.PASSWD !== passwd) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Invalid credentials." });
    }

    // 5. Login is successful. Send back user info (without the password).
    // In a real application, you would generate and send a JSON Web Token (JWT) here.
    const userPayload = {
      cno: customer.CNO,
      name: customer.NAME,
      email: customer.EMAIL,
      isAdmin: customer.CNO === "cO", // Add a flag for the admin user
    };

    res.status(200).json({
      message: "Login successful!",
      user: userPayload,
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Login Error:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
}

module.exports = {
  login,
};
