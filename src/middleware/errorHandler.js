
function errorHandler(err, req, res, next) {
    // Log the error for debugging
    console.error(err);
  
    // Handle different types of errors
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      // Syntax error in request body
      res.status(400).json({ error: 'Bad request' });
    } else {
      // Generic server error
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  module.exports = errorHandler;