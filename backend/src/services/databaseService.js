const oracledb = require("oracledb");

// ... (keep the existing 'execute' function)

/**
 * Gets a connection from the pool to manage a transaction manually.
 * @returns {Promise<object>} A database connection object.
 */
async function getConnectionForTransaction() {
  try {
    const connection = await oracledb.getConnection();
    return connection;
  } catch (err) {
    console.error("Error getting connection for transaction:", err);
    throw err;
  }
}

module.exports = { execute, getConnectionForTransaction }; // Add the new export
