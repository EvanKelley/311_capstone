
const mysql = require("mysql2");
const dotenv = require("dotenv");
const argon = require("argon2");
const db = require("../db");
const jwt = require("jsonwebtoken");


// Register a new user
// ===================
// accept the email and password
// store the email and hash
let registerUser = async function(req, res){
  // get the email and password for the request
  let email = req.body.email;
  let password = req.body.password;
  
  // make sure the email is truthy
  if(!email){
    res.status(400).json("Email is required");
    return;
  }

  // convert password to its hash
  let hash
  try{
    hash = await argon.hash(password);
  }catch(err){
    // if for some reason the conversion fails, 
    // log the error, and resonpse with 500 code,
    console.log("Failed to hash the password", err);
    res.sendStatus(500);
    return;
  }

  // I have the hash and email
  let sql = "insert into users (email, hash) values (?, ?)";
  let params = [email, hash];

  db.query(sql, params, function(err, results){
    if(err){
      console.log("Failed to register a user", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
 };


 
// Login existing user
// ===================
let loginUser = function(req, res){

    let email = req.body.email;
    let password = req.body.password;
  
    let sql = "select id, password from users where email = ?";
    let params = [email];
  
    db.query(sql, params, async function(err, results){
      let storedHash;
      let storedId;
      if(err){
          console.log("Failed to fetch hash for user", err);
      } else if (results.length > 1) {
          console.log("Returned more than 1 user for the email", email);
      } else if (results.length == 1) {
          storedHash = results[0].hash;
          storedId = results[0].id;
      } else if (results.length == 0) {
          console.log("Did not find a user for email", email);
      }
  
      try{
        let pass = await argon.verify(storedHash, password);
        if(pass){
          // Generate a token and send it back
          let token = {
            id: storedId,
            email: email
          }; 
          
          // Token is good for 1 day 
          let signedToken = jwt.sign(token, process.env.JWT_SECRET,{expiresIn: 86400});
          res.json(signedToken);
  
        } else {
          res.sendStatus(401);
        }
      } catch(err){
          console.log("Failed when verifying the hash", err);
          res.sendStatus(401);
      }
    });
  };

  module.exports = {
    registerUser,
    loginUser
  };