
const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const authMiddleware = require('../middleware/auths')
const db = require('../db');



// Character Management Routes

// Retrieve a list of characters belonging to the authenticated user
router.get("/characters", authMiddleware.checkJWT, controller.getCharacters);
// Create a new character for the authenticated user
router.post("/characters", authMiddleware.checkJWT, controller.createCharacter);
// Retrieve details of a specific character
router.get("/characters/:characterId", authMiddleware.checkJWT, controller.getCharacterById);
// Update details of a specific character
router.put("/characters/:characterId", authMiddleware.checkJWT, controller.updateCharacter);
// Delete a specific character
router.delete("/characters/:characterId", authMiddleware.checkJWT, controller.deleteCharacter);


// Abilities and Items Routes

// Retrieve a list of abilities for a character
router.get("/characters/:characterId/abilities", controller.getAbilities);
// Add a new ability to a character
router.post("/characters/:characterId/abilities", controller.addAbility);
// Update details of a specific ability
router.put("/characters/:characterId/abilities/:abilityId", controller.updateAbility);
// Delete a specific ability from a character
router.delete("/characters/:characterId/abilities/:abilityId", controller.deleteAbility);
// Add a new item to a character's inventory
router.get("/characters/:characterId/items", controller.getItems);
// Update details of a specific item
router.post("/characters/:characterId/items", controller.addItem);
// Retrieve a list of items in a character's inventory
router.put("/characters/:characterId/items/:itemId", controller.updateItem);
// Delete a specific item from a character's inventory
router.delete("/characters/:characterId/items/:itemId", controller.deleteItem);

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