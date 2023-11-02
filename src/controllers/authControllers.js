
const mysql = require("mysql2");
const dotenv = require("dotenv");
const argon = require("argon2");
const db = require("../db");
const jwt = require("jsonwebtoken");

dotenv.config();

// Register a new user

// accept the email and password
// store the email and hash
let registerUser = async function (req, res) {
  console.log("inside register route");
  // get the email and password for the request
  let email = req.body.email;
  let password = req.body.password;

  // make sure the email is truthy
  if (!email) {
    res.status(400).json("Email is required");
    return;
  }

  // convert password to its hash
  let hash;
  try {
    hash = await argon.hash(password);
  } catch (err) {
    // if for some reason the conversion fails,
    // log the error, and response with 500 code,
    console.log("Failed to hash the password", err);
    res.sendStatus(500);
    return;
  }

  // I have the hash and email
  console.log('before query')
  let sql = "INSERT INTO users (email, password) VALUES (?, ?)"; // Changed 'hash' to 'password'
  let params = [email, hash];

  db.query(sql, params, (err, results) => {
    console.log(results, 'these are the results')
    console.log(err, 'these are the error')
    if (err) {
      console.log("Failed to register a user", err);
      res.sendStatus(500);
    } else {
      // res.sendStatus(204);
      console.log(results);
      res.json({id:results.insertId,msg:"User registered successfully"});
    }
  });
};
 

// Login existing user
let loginUser = function (req, res) {
  let email = req.body.email;
  let password = req.body.password;

  let sql = "SELECT user_id, password FROM users WHERE email = ?";
  let params = [email];

  db.query(sql, params, async function (err, results) {
    if (err) {
      console.error("Database error while retrieving user data:", err);
      return res.sendStatus(500); // Internal Server Error
    }

    if (results.length === 0) {
      console.log("No user found for email:", email);
      return res.sendStatus(401); // Unauthorized
    }

    if (results.length > 1) {
      console.error("Returned more than 1 user for the email:", email);
      return res.sendStatus(500); // Internal Server Error
    }

    // At this point, there's only one user with the provided email
    let storedHash = results[0].password;
    let storedId = results[0].user_id;

    try {
      let pass = await argon.verify(storedHash, password);
      if (pass) {
        // Generate a token and send it back
        const tokenPayload = {
          user_id: storedId,
          email: email,
        };

        const tokenOptions = {
          expiresIn: "24h", // Token is good for 24 hours
        };

        const signedToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, tokenOptions);
        // res.json(signedToken);
        res.json({
          token: signedToken,
          userId: storedId
        });
      } else {
        console.log("Password verification failed for email:", email);
        res.sendStatus(401); // Unauthorized
      }
    } catch (err) {
      console.error("Failed when verifying the hash:", err);
      res.sendStatus(500); // Internal Server Error
    }
  });
};



  module.exports = {
    registerUser,
    loginUser
  };