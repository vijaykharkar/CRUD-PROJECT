
const pool = require("./pool");

const createTables = async () => {
  const createStudentsTable = `
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      age INTEGER NOT NULL
    );
  `;

  const createMarksTable = `
    CREATE TABLE IF NOT EXISTS marks (
      id SERIAL PRIMARY KEY,
      subject VARCHAR(100) NOT NULL,
      score INTEGER NOT NULL,
      student_id INTEGER REFERENCES students(id) ON DELETE CASCADE
    );
  `;

  try {
    await pool.query(createStudentsTable);
    await pool.query(createMarksTable);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables", err);
  } finally {
    await pool.end(); // Close the connection pool
  }
};

createTables();
