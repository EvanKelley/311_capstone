CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(1000) NOT NULL
);

CREATE TABLE characters (
    character_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    race VARCHAR(100),
    characterClass VARCHAR(100),
    level INT,
    experience_points INT,
    alignment VARCHAR(20),
    background VARCHAR(100),
    hit_points INT,
    armor_class INT,
    strength INT,
    dexterity INT,
    constitution INT,
    intelligence INT,
    wisdom INT,
    charisma INT
);

CREATE TABLE character_attributes (
    attribute_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    character_id INTEGER,
    attribute_key VARCHAR(50),
    attribute_value VARCHAR(255),
    FOREIGN KEY (character_id) REFERENCES characters(character_id)
);


CREATE table abilities (
    ability_id INTEGER PRIMARY KEY,
    character_id INTEGER,
    abilityName VARCHAR(100),
    abilityDescription VARCHAR(1000),
    FOREIGN KEY (character_id) REFERENCES characters(character_id)
);


CREATE table items (
    item_id INTEGER PRIMARY KEY,
    character_id INTEGER,
    itemName VARCHAR(1000),
    itemDescription VARCHAR(2500),
    itemType VARCHAR(100),
    rarity VARCHAR(100),
    itemValue INTEGER,
    properties VARCHAR(2500),
    FOREIGN KEY (character_id) REFERENCES characters(character_id)
);


CREATE table spells (
    spell_id INTEGER PRIMARY KEY,
    spellName VARCHAR(100),
    spellLevel INTEGER,
    school VARCHAR(100),
    casting_time INTEGER,
    spellRange INTEGER,
    components VARCHAR(100),
    duration VARCHAR(100),
    spellDescription VARCHAR(2500)
);


CREATE TABLE character_spells (
    character_id INTEGER,
    spell_id INTEGER,
    PRIMARY KEY (character_id, spell_id),
    FOREIGN KEY (character_id) REFERENCES characters(character_id),
    FOREIGN KEY (spell_id) REFERENCES spells(spell_id)
);



let registerUser = async function(req, res){
  console.log ("inside register route")
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
    // log the error, and response with 500 code,
    console.log("Failed to hash the password", err);
    res.sendStatus(500);
    return;
  }

  // I have the hash and email
  console.log('before query')
  let sql = "insert into users (email, hash) values (?, ?)";
  let params = [email, hash];

  db.query(sql, params, (err, results) => {
    console.log(results, 'these are the results')
    console.log(err, 'these are the error')
    if(err){
      console.log("Failed to register a user", err);
      res.sendStatus(500);
    } 
      // res.sendStatus(204);
      console.log(results);
      res.send("It worked");
      // console.log("Work please");
      // res.json(results);
      // res.json(results).status(200).end()
    
  });
 };

 // Login existing user
let loginUser = function(req, res){

    let email = req.body.email;
    let password = req.body.password;
  
    let sql = "select user_id, hash from users where email = ?";
    let params = [email];
  
    db.query(sql, params, async function(err, results){
      let storedHash;
      let storedId;
      if(err){
          console.log("Failed to fetch hash for user", err);
      } else if (results.length > 1) {
          console.log("Returned more than 1 user for the email", email);
      } else if (results.length === 1) {
          storedHash = results[0].hash;
          storedId = results[0].user_id;
      } else if (results.length === 0) {
          console.log("Did not find a user for email", email);
      }
  
      try{
        let pass = await argon.verify(storedHash, password);
        if(pass){
          // Generate a token and send it back
          let token = {
            user_id: storedId,
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