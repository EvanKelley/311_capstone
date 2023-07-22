const express = require('express');
const app = express();
const routes = require('./routes/routes');
const authRoutes = require("./routes/authRoutes");

// Middleware to parse incoming requests as JSON
app.use(express.json());

// Include your routes
app.use('/api', routes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send("Hello there!")
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});