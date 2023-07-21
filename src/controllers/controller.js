const axios = require('axios');
const API_BASE_URL = 'https://www.dnd5eapi.co/api/';
const db = require('./db');



// Create a new character
async function createCharacter(req, res) {
  const { name, race, characterClass, ...otherAttributes } = req.body;

  const characterData = [
    name,
    race,
    characterClass,
    otherAttributes.level,
    otherAttributes.experience_points,
    otherAttributes.alignment,
    otherAttributes.background,
    otherAttributes.hit_points,
    otherAttributes.armor_class,
    otherAttributes.strength,
    otherAttributes.dexterity,
    otherAttributes.constitution,
    otherAttributes.intelligence,
    otherAttributes.wisdom,
    otherAttributes.charisma,
  ];

  try {
    // Perform database insertion to create the new character
    const result = await db.query('INSERT INTO characters (name, race, class, level, experience_points, alignment, background, hit_points, armor_class, strength, dexterity, constitution, intelligence, wisdom, charisma) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [...characterData]);

    // If the character was successfully created, return a success response
    return res.status(201).json({ success: true, message: 'Character created successfully', characterId: result.insertId });
  } catch (error) {
    // Handle any errors that occurred during character creation
    console.error('Error creating character:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// List users characters 

// Retreive specific character

// Update specific character

// Delete specific character


// Add a new ability to a character

// Retrieve a list of abilities for a character

// Update details of a specific ability

// Delete a specific ability from a character


// Add a new item to a character's inventory

// Retrieve a list of items in a character's inventory

// Update details of a specific item

// Delete a specific item from a character's inventory


// Retrieve a list of all available spells

// Retrieve details of a specific spell


// Retrieve a list of available rule references

// Retrieve details of a specific rule reference
async function getRuleByName(ruleName) {
  try {
    const response = await axios.get(`${API_BASE_URL}rules/?name=${encodeURIComponent(ruleName)}`);
    return response.data;
  } catch (error) {
    // Handle error, such as invalid rule name or API connection issue
    console.error('Error fetching rules:', error.message);
    throw error;
  }
};



  module.exports = {
    searchRulesByName,
    createCharacter,
  };
