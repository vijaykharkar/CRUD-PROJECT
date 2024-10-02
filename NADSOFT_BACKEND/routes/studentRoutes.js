const express = require("express");
const {
  createStudentMarkController,
  getAllStudentData,
  updateStudentMarkController,
  deleteStudentMarkController,
} = require("../controllers/studentController");

const router = express.Router();

router.get("/", getAllStudentData);
router.post("/create", createStudentMarkController);
router.post("/update-student", updateStudentMarkController);
router.delete("/students/:id", deleteStudentMarkController);
// Define other student-related routes here

module.exports = router;