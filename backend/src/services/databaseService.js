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
    // Get a connection from the default pool
    connection = await oracledb.getConnection();

    // Set default options
    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // Return results as javascript objects
      ...opts,
    };

    // Execute the statement
    const result = await connection.execute(statement, binds, options);

    return result;
  } catch (err) {
    console.error("Database execution error:", err);
    // Re-throw the error to be handled by the calling function
    throw err;
  } finally {
    if (connection) {
      try {
        // Release the connection back to the pool
        await connection.close();
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
}

module.exports = { execute };
