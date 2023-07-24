
const axios = require('axios');
const API_BASE_URL = 'https://www.dnd5eapi.co/api/';
const db = require('../db');



// Retrieve a list of characters belonging to a user
async function getCharacters(req, res) {
  // Assuming implementation of user authentication and have obtained the user's ID
  const userId = req.user.id;

  try {
    // Fetch characters from the database for the authenticated user
    const characters = await db.query('SELECT * FROM characters WHERE user_id = ?', [userId]);

    // Send the list of characters as the response
    res.status(200).json(characters);
  } catch (error) {
    // Handle error, such as database query issue
    console.error('Error fetching characters:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
} 


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


// Retreive specific character
async function getCharacterById(req, res) {
  const characterId = req.params.characterId; // Extract the characterId from request parameters

  try {
    // Fetch the character from the database based on the characterId
    const character = await db.query('SELECT * FROM characters WHERE character_id = ?', [characterId]);

    // Check if the character exists
    if (!character || character.length === 0) {
      return res.status(404).json({ error: 'Character not found.' });
    }

    // Send the character data as the response
    res.status(200).json(character[0]);
  } catch (error) {
    // Handle error, such as database query issue
    console.error('Error fetching character:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Update specific character
async function updateCharacter(req, res) {
  const characterId = req.params.characterId; // Extract the characterId from request parameters
  const updatedCharacterData = req.body; // Get the updated character data from the request body

  try {
    // Update the character in the database based on the characterId
    const result = await db.query('UPDATE characters SET ? WHERE character_id = ?', [updatedCharacterData, characterId]);

    // Check if the character was updated successfully
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Character not found.' });
    }

    // Send a success message as the response
    res.status(200).json({ message: 'Character updated successfully.' });
  } catch (error) {
    // Handle error, such as database query issue
    console.error('Error updating character:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// Delete specific character
async function deleteCharacter(req, res) {
  const characterId = req.params.characterId; // Extract the characterId from request parameters

  try {
    // Delete the character from the database based on the characterId
    const result = await db.query('DELETE FROM characters WHERE character_id = ?', [characterId]);

    // Check if the character was deleted successfully
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Character not found.' });
    }

    // Send a success message as the response
    res.status(200).json({ message: 'Character deleted successfully.' });
  } catch (error) {
    // Handle error, such as database query issue
    console.error('Error deleting character:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Retrieve a list of abilities for a character
async function getAbilities(req, res) {
  const characterId = req.params.characterId; // Extract the characterId from request parameters

  try {
    // Fetch the abilities from the database for the specific character
    const abilities = await db.query('SELECT * FROM abilities WHERE character_id = ?', [characterId]);

    // Send the list of abilities as the response
    res.status(200).json(abilities);
  } catch (error) {
    // Handle error, such as database query issue
    console.error('Error fetching abilities:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Add a new ability to a character
async function addAbility(req, res) {
  const { characterId } = req.params;
  const { abilityName, abilityDescription, ...otherAttributes } = req.body;

  try {
    // Insert the ability data into the character_attributes table
    const result = await db.query('INSERT INTO character_attributes (character_id, attribute_key, attribute_value) VALUES (?, ?, ?)', [characterId, 'abilityName', abilityName]);
    await db.query('INSERT INTO character_attributes (character_id, attribute_key, attribute_value) VALUES (?, ?, ?)', [characterId, 'abilityDescription', abilityDescription]);

    // Insert any additional attributes dynamically
    for (const attributeKey in otherAttributes) {
      await db.query('INSERT INTO character_attributes (character_id, attribute_key, attribute_value) VALUES (?, ?, ?)', [characterId, attributeKey, otherAttributes[attributeKey]]);
    }

    return res.status(201).json({ success: true, message: 'Ability added successfully' });
  } catch (error) {
    console.error('Error adding ability:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// Update details of a specific ability
async function updateAbility(req, res) {
  const characterId = req.params.characterId; // Extract the characterId from request parameters
  const abilityId = req.params.abilityId; // Extract the abilityId from request parameters
  const updatedAbilityData = req.body; // Get the updated ability data from the request body

  try {
    // Update the ability in the database based on the characterId and abilityId
    const result = await db.query('UPDATE abilities SET ? WHERE character_id = ? AND ability_id = ?', [updatedAbilityData, characterId, abilityId]);

    // Check if the ability was updated successfully
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ability not found.' });
    }

    // Send a success message as the response
    res.status(200).json({ message: 'Ability updated successfully.' });
  } catch (error) {
    // Handle error, such as database query issue
    console.error('Error updating ability:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Delete a specific ability from a character
async function deleteAbility(req, res) {
  const characterId = req.params.characterId; // Extract the characterId from request parameters
  const abilityId = req.params.abilityId; // Extract the abilityId from request parameters

  try {
    // Delete the ability from the database based on the characterId and abilityId
    const result = await db.query('DELETE FROM abilities WHERE character_id = ? AND ability_id = ?', [characterId, abilityId]);

    // Check if the ability was deleted successfully
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ability not found for this character.' });
    }

    // Send a success message as the response
    res.status(200).json({ message: 'Ability deleted successfully.' });
  } catch (error) {
    // Handle error, such as database query issue
    console.error('Error deleting ability:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Retrieve a list of items in a character's inventory
async function getItems(req, res) {
  const characterId = req.params.characterId; // Extract the characterId from request parameters

  try {
    // Fetch the items from the database for the specific character
    const items = await db.query('SELECT * FROM items WHERE character_id = ?', [characterId]);

    // Send the list of items as the response
    res.status(200).json(items);
  } catch (error) {
    // Handle error, such as database query issue
    console.error('Error fetching items:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Add a new item to a character's inventory
async function addItem(req, res) {
  const characterId = req.params.characterId; // Extract the characterId from request parameters
  const newItemData = req.body; // Get the new item data from the request body

  try {
    // Add the new item to the database with the specified characterId
    const result = await db.query('INSERT INTO items SET character_id = ?, ?', [characterId, newItemData]);

    // Check if the item was added successfully
    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Error adding item to inventory.' });
    }

    // Send a success message as the response
    res.status(200).json({ message: 'Item added to inventory successfully.' });
  } catch (error) {
    // Handle error, such as database query issue
    console.error('Error adding item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 


// Update details of a specific item
async function updateItem(req, res) {
  const characterId = req.params.characterId; // Extract the characterId from request parameters
  const itemId = req.params.itemId; // Extract the itemId from request parameters
  const updatedItemData = req.body; // Get the updated item data from the request body

  try {
    // Update the item in the database based on the characterId and itemId
    const result = await db.query('UPDATE items SET ? WHERE character_id = ? AND item_id = ?', [updatedItemData, characterId, itemId]);

    // Check if the item was updated successfully
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found for this character.' });
    }

    // Send a success message as the response
    res.status(200).json({ message: 'Item updated successfully.' });
  } catch (error) {
    // Handle error, such as database query issue
    console.error('Error updating item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Delete a specific item from a character's inventory
async function deleteItem(req, res) {
  const characterId = req.params.characterId; // Extract the characterId from request parameters
  const itemId = req.params.itemId; // Extract the itemId from request parameters

  try {
    // Delete the item from the database based on the characterId and itemId
    const result = await db.query('DELETE FROM items WHERE character_id = ? AND item_id = ?', [characterId, itemId]);

    // Check if the item was deleted successfully
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found for this character.' });
    }

    // Send a success message as the response
    res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (error) {
    // Handle error, such as database query issue
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Retrieve a list of all available spells
// async function getSpells(req, res) {
//   try {
//     // Make a GET request to the API endpoint for spells
//     const response = await axios.get(`${API_BASE_URL}spells`);
//     const spellsList = response.data;

//     // Send the list of spells as the response
//     res.status(200).json(spellsList);
//   } catch (error) {
//     // Handle error, such as API connection issue
//     console.error('Error fetching spells:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
async function getSpells(req, res) {
  try {
    console.log('Request to /test-spells received.');
    // Sample static data of spells (replace this with your actual data from the API)
    const spells = [
      { id: 1, name: 'Fireball', level: 3 },
      { id: 2, name: 'Magic Missile', level: 1 },
      { id: 3, name: 'Cure Wounds', level: 1 },
      // Add more spells here...
    ];

    // Send the list of spells as the response
    res.status(200).json(spells);
  } catch (error) {
    // Handle error, such as API connection issue
    console.error('Error fetching spells:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Retrieve details of a specific spell
async function getSpellByName(spellName) {
  try {
    // Make a get request to the API for spells with specified anme
    const response = await axios.get(`${API_BASE_URL}spells/?name=${encodeURIComponent(spellName)}`);
    const spellData = response.data;

    // If the ruleData is an empty array, it means the rule with the given name does not exist
    if (Array.isArray(spellData) && spellData.length === 0) {
      throw new Error(`Spell "${spellName}" not found.`);
    }   
    
    // If the spellData is an array, assume the first item is the spell data
    if (Array.isArray(spellData)) {
      return spellData[0];
    }

    // If the spellData is not an array, return it as is
    return spellData;
  } catch (error) {
    // Handle error, such as invalid spell name or API connection issue
    console.error('Error fetching spells', error.message);
    throw error;
  }
};


// Retrieve a list of available rule references
async function getRules(req, res) {
  try {
    // Make a GET request to the API endpoint for rules
    const response = await axios.get(`${API_BASE_URL}rules`);
    const rulesList = response.data;

    // Send the list of spells as the response
    res.status(200).json(rulesList);
  } catch (error) {
    // Handle error, such as API connection issue
    console.error('Error fetching rules:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Look up a specific rule reference
async function getRuleByName(ruleName) {
  try {
    const response = await axios.get(`${API_BASE_URL}rules/?name=${encodeURIComponent(ruleName)}`);
    const ruleData = response.data;

    // If the ruleData is an empty array, it means the rule with the given name does not exist
    if (Array.isArray(ruleData) && ruleData.length === 0) {
      throw new Error(`Rule "${ruleName}" not found.`);
    }

    // If the ruleData is an array, assume the first item is the rule data
    if (Array.isArray(ruleData)) {
      return ruleData[0];
    }

    // If the ruleData is not an array, return it as is
    return ruleData;
  } catch (error) {
    // Handle error, such as invalid rule name or API connection issue
    console.error('Error fetching rules:', error.message);
    throw error;
  }
};


// Exports
module.exports = {
  getCharacters,
  createCharacter,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
  getAbilities,
  addAbility,
  updateAbility,
  deleteAbility,
  getItems,
  addItem,
  updateItem,
  deleteItem,
  getSpells,
  getSpellByName,
  getRules,
  getRuleByName
};