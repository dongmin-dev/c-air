const oracledb = require("oracledb");

/**
 * Executes a database query.
 * @param {string} statement The SQL statement to execute.
 * @param {object | Array} binds The bind parameters for the query.
 * @param {object} opts The query execution options.
 * @returns {Promise<object>} The result of the query execution.
 */
async function execute(statement, binds = [], opts = {}) {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...opts,
    };
    const result = await connection.execute(statement, binds, options);
    return result;
  } catch (err) {
    console.error("Database execution error:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
}

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

// Ensure both functions are exported correctly
module.exports = { execute, getConnectionForTransaction };
