const oracledb = require("oracledb");

// Configuration for the database connection pool
const poolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
  poolMin: 10,
  poolMax: 10,
  poolIncrement: 0,
};

async function initialize() {
  console.log("Initializing database connection pool...");
  try {
    await oracledb.createPool(poolConfig);
    console.log("Database connection pool initialized successfully.");
  } catch (err) {
    console.error("Error initializing database pool:", err);
    // Exit the process if the database connection fails, as the app cannot run without it.
    process.exit(1);
  }
}

async function close() {
  console.log("Closing database connection pool...");
  try {
    await oracledb.getPool().close(10);
    console.log("Database connection pool closed.");
  } catch (err) {
    console.error("Error closing the database pool:", err);
  }
}

// Function to execute a simple query for connection testing
async function testConnection() {
  let connection;
  try {
    connection = await oracledb.getConnection();
    console.log("Database connection successful!");
    // A simple query to verify
    const result = await connection.execute(`SELECT 1 FROM DUAL`);
    console.log("Test query result:", result.rows[0][0]);
  } catch (err) {
    console.error("Database connection test failed:", err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection for test:", err);
      }
    }
  }
}

module.exports = { initialize, close, testConnection };
