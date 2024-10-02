const express = require("express");
const studentRoutes = require("./routes/studentRoutes");
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

app.use(studentRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});