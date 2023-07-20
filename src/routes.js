const express = require('express');
const router = express.Router();
const db = require('./db');

// Define routes here
// User Authentication
// ===================
// POST /api/signup: Create a new user account.
// POST /api/login: Log in an existing user and obtain an authentication token (JWT).
// GET /api/logout: Log out the currently logged-in user.


// Character Management
// ====================
// POST /api/characters: Create a new character for the authenticated user.
router.post("/api/characters", controller.createCharacter);
// GET /api/characters: Retrieve a list of characters belonging to the authenticated user.
router.get("/api/characters", controller.getCharacters);
// GET /api/characters/:characterId: Retrieve details of a specific character.
// PUT /api/characters/:characterId: Update details of a specific character.
// DELETE /api/characters/:characterId: Delete a specific character.


// Abilities and Items
// ===================
// POST /api/characters/:characterId/abilities: Add a new ability to a character.
// GET /api/characters/:characterId/abilities: Retrieve a list of abilities for a character.
// PUT /api/characters/:characterId/abilities/:abilityId: Update details of a specific ability.
// DELETE /api/characters/:characterId/abilities/:abilityId: Delete a specific ability from a character.
// POST /api/characters/:characterId/items: Add a new item to a character's inventory.
// GET /api/characters/:characterId/items: Retrieve a list of items in a character's inventory.
// PUT /api/characters/:characterId/items/:itemId: Update details of a specific item.
// DELETE /api/characters/:characterId/items/:itemId: Delete a specific item from a character's inventory.


// Spells
// ======
// GET /api/spells: Retrieve a list of all available spells.
// GET /api/spells/:spellId: Retrieve details of a specific spell.
// Rule Lookup:
// GET /api/rules: Retrieve a list of available rule references.
// GET /api/rules/:ruleId: Retrieve details of a specific rule reference.

module.exports = router;