
const express = require('express');
const app = express();
const routes = require('./routes/routes');
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler")

// Middleware to parse incoming requests as JSON
app.use(express.json());

// Include your routes
app.use('/api', routes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send("Hello there!")
});

// Handle Errors
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});