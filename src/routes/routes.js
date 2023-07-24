
const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const db = require('../db');



// Character Management Routes

// Retrieve a list of characters belonging to the authenticated user
router.get("/api/characters", controller.getCharacters);
// Create a new character for the authenticated user
router.post("/api/characters", controller.createCharacter);
// Retrieve details of a specific character
router.get("/api/characters/:characterId", controller.getCharacterById);
// Update details of a specific character
router.put("/api/characters/:characterId", controller.updateCharacter);
// Delete a specific character
router.delete("/api/characters/:characterId", controller.deleteCharacter);


// Abilities and Items Routes

// Retrieve a list of abilities for a character
router.get("/api/characters/:characterId/abilities", controller.getAbilities);
// Add a new ability to a character
router.post("/api/characters/:characterId/abilities", controller.addAbility);
// Update details of a specific ability
router.put("/api/characters/:characterId/abilities/:abilityId", controller.updateAbility);
// Delete a specific ability from a character
router.delete("/api/characters/:characterId/abilities/:abilityId", controller.deleteAbility);
// Add a new item to a character's inventory
router.get("/api/characters/:characterId/items", controller.getItems);
// Update details of a specific item
router.post("/api/characters/:characterId/items", controller.addItem);
// Retrieve a list of items in a character's inventory
router.put("/api/characters/:characterId/items/:itemId", controller.updateItem);
// Delete a specific item from a character's inventory
router.delete("/api/characters/:characterId/items/:itemId", controller.deleteItem);

// Spell Routes

router.get("/test-spells", async (req, res) => {
    try {
      const spells = await controller.getSpells(req, res);
      res.json(spells);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
// Retrieve a list of all available spells
router.get("/api/spells", controller.getSpells);
// Retrieve details of a specific spell
router.get("/api/spells/:spellId", controller.getSpellByName);



// Rules Routes

// Retrieve a list of available rule references
router.get("/api/rules", controller.getRules);
// Retrieve details of a specific rule reference
router.get("/api/rules/:ruleId", controller.getRuleByName);



// Export
module.exports = router;