const pool = require("../db/pool");

const getAllStudentData = async (req, res) => {
  try {
    const query = `
            SELECT s.id, s.name, s.email, s.age, m.subject, m.score
            FROM students s
            LEFT JOIN marks m ON s.id = m.student_id
        `;

    const client = await pool.connect();

    const result = await client.query(query);

    client.release();

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching data: ", err.message);
    res.status(500).send("Server Error");
  }
};

const createStudentMarkController = async (req, res) => {
  const { id, name, email, age, subject, score } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Start transaction

    // Check if student ID already exists
    const checkIdQuery = `
            SELECT id FROM students WHERE id = $1
        `;
    const idCheckResult = await client.query(checkIdQuery, [id]);

    if (idCheckResult.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Student ID already exists" });
    }

    // Check if student email already exists
    const checkEmailQuery = `
            SELECT id FROM students WHERE email = $1
        `;
    const emailCheckResult = await client.query(checkEmailQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Email already exists" });
    }

    // Insert into students table
    const insertStudentQuery = `
            INSERT INTO students (id, name, email, age)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;
    const studentValues = [id, name, email, age];
    const studentResult = await client.query(insertStudentQuery, studentValues);
    const studentId = studentResult.rows[0].id;

    // Insert into marks table
    const insertMarkQuery = `
            INSERT INTO marks (subject, score, student_id)
            VALUES ($1, $2, $3)
        `;
    const markValues = [subject, score, studentId];
    await client.query(insertMarkQuery, markValues);

    await client.query("COMMIT"); // Commit transaction

    res.status(201).send(req.body);
  } catch (err) {
    // Handle specific errors
    if (err.code === "23505") {
      // PostgreSQL unique violation error handling
      if (err.constraint === "students_pkey") {
        return res.status(400).json({ error: "Student ID already exists" });
      } else if (err.constraint === "students_email_key") {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    await client.query("ROLLBACK"); // Rollback transaction on error
    console.error("Error creating student: ", err.message);
    res.status(500).send("Server Error");
  } finally {
    client.release();
  }
};

const updateStudentMarkController = async (req, res) => {
  const { id, name, email, age, subject, score } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Start transaction

    // Check if student with given ID exists
    const checkExistingStudentQuery = `
            SELECT id FROM students WHERE id = $1
        `;
    const existingStudentResult = await client.query(
      checkExistingStudentQuery,
      [id]
    );

    if (existingStudentResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Student not found" });
    }

    // Update student details
    const updateStudentQuery = `
            UPDATE students SET name = $2, email = $3, age = $4
            WHERE id = $1
        `;
    const updateStudentValues = [id, name, email, age];
    await client.query(updateStudentQuery, updateStudentValues);

    // Update mark details (if necessary)
    if (subject !== undefined && score !== undefined) {
      const updateMarkQuery = `
                UPDATE marks SET subject = $2, score = $3
                WHERE student_id = $1
            `;
      const updateMarkValues = [id, subject, score];
      await client.query(updateMarkQuery, updateMarkValues);
    }

    await client.query("COMMIT"); // Commit transaction

    res.status(200).send("Student updated successfully");
  } catch (err) {
    await client.query("ROLLBACK"); // Rollback transaction on error
    console.error("Error updating student: ", err.message);

    // Handle specific errors
    if (err.code === "23505") {
      // PostgreSQL unique violation error handling
      if (err.constraint === "students_email_key") {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    res.status(500).send("Server Error");
  } finally {
    client.release();
  }
};


const deleteStudentMarkController = async (req, res) => {
    const { id } = req.params; // Get student ID from request parameters
  
    const client = await pool.connect();
  
    try {
      await client.query("BEGIN"); // Start transaction
  
      // Delete from marks table
      const deleteMarksQuery = `
        DELETE FROM marks WHERE student_id = $1
      `;
      await client.query(deleteMarksQuery, [id]);
  
      // Delete from students table
      const deleteStudentQuery = `
        DELETE FROM students WHERE id = $1
      `;
      const deleteResult = await client.query(deleteStudentQuery, [id]);
  
      // Check if student was deleted
      if (deleteResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: 'Student not found' });
      }
  
      await client.query("COMMIT"); // Commit transaction
  
      res.status(200).send("Student and associated marks deleted successfully");
    } catch (err) {
      await client.query("ROLLBACK"); // Rollback transaction on error
      console.error("Error deleting student: ", err.message);
      res.status(500).send("Server Error");
    } finally {
      client.release();
    }
  };
  
module.exports = { getAllStudentData, createStudentMarkController , updateStudentMarkController ,deleteStudentMarkController };

