const express = require("express");
const router = express.Router();

const controller = require("../controllers/authControllers");


// Create a new user account
router.post("/signup", controller.registerUser);

// Log in an existing user and obtain an authentication token (JWT)
router.post("/login", controller.loginUser);


module.exports = router;