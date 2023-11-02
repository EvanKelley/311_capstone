const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const routes = require('./routes/routes');
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler")



// Load environment variables from a .env file
require('dotenv').config();

// Bring in cors & bodyParser
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to parse incoming requests as JSON
app.use(express.json());

// Include routes
app.use('/', routes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send("Hello there!")
});

app.get('/hello', (req, res) => {
  res.send("Hello there!")
});

// Handle Errors
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});