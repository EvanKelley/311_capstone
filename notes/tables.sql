CREATE table users (
    user_id INTEGER PRIMARY KEY auto_increment,
    email REQUIRED UNIQUE VARCHAR(100),
    password VARCHAR(1000)
);


CREATE TABLE characters (
    character_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER FOREIGN KEY,
    characterName VARCHAR(100),
    race VARCHAR(100),
    class VARCHAR(100),
    characterLevel INTEGER,
    alignment VARCHAR(20),
    background VARCHAR(100),
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
