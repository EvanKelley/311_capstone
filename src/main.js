const express = require('express');
const app = express();
const routes = require('./routes/routes');

// Middleware to parse incoming requests as JSON
app.use(express.json());

// Include your routes
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});