const db = require("./databaseService");

/**
 * Finds a customer by their unique customer number (cno).
 * @param {string} cno The customer number to search for.
 * @returns {Promise<object|null>} The customer object if found, otherwise null.
 */
async function findByCno(cno) {
  const sql = `
    SELECT 
      CNO, 
      NAME, 
      PASSWD, 
      EMAIL, 
      PASSPORTNUMBER 
    FROM CUSTOMER 
    WHERE CNO = :cno
  `;

  const binds = [cno];

  try {
    const result = await db.execute(sql, binds);

    // The execute function returns rows as an array. If a user is found, it will be the first element.
    if (result.rows.length > 0) {
      // The database column names are uppercase by default in Oracle.
      // The databaseService returns them as objects like { CNO: 'c1', ... }
      // We will return this object directly.
      return result.rows[0];
    } else {
      return null; // No customer found
    }
  } catch (err) {
    console.error("Error finding customer by CNO:", err);
    throw err; // Re-throw the error to be handled by the controller
  }
}

module.exports = {
  findByCno,
};
