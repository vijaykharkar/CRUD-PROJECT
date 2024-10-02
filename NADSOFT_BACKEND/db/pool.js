const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "vijay1016",
  port: 5432,
  database: "student_db",
});

// pool.query(`CREATE DATABASE Student_Db`, (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(`Database created successfully!`);
//   }
// });

module.exports = pool;
