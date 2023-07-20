const axios = require('axios');
const API_BASE_URL = 'https://www.dnd5eapi.co/api/';

// Function to fetch rules by name
async function searchRulesByName(ruleName) {
  try {
    const response = await axios.get(`${API_BASE_URL}rules/?name=${encodeURIComponent(ruleName)}`);
    return response.data;
  } catch (error) {
    // Handle error, such as invalid rule name or API connection issue
    console.error('Error fetching rules:', error.message);
    throw error;
  }
};

// Function to create a new character
async function createCharacter(req, res) {
  const { name, race, class, ...otherDetails } = req.body;

  // Validate the incoming data, if needed

  try {
    // Perform database insertion to create the new character
    const result = await db.query('INSERT INTO characters (name, race, class, ...) VALUES (?, ?, ?, ...)', [name, race, class, ...]);

    // If the character was successfully created, return a success response
    return res.status(201).json({ success: true, message: 'Character created successfully', characterId: result.insertId });
  } catch (error) {
    // Handle any errors that occurred during character creation
    console.error('Error creating character:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
  
  module.exports = {
    searchRulesByName,
    createCharacter,
  };





// Usage example
searchRulesByName('spellcasting'); // Replace 'spellcasting' with desired rule name