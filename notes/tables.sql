CREATE table users (
    user_id integer primary key auto_increment,
    username varchar(25),
    email required varchar(100),
    password_hash
);

CREATE table characters (
    character_id integer primary key auto_increment,
    user_id (Foreign Key referencing the Users table),
    name varchar(100),
    race varchar(100),
    class varchar(100),
    level integer,
    experience_points integer,
    alignment varchar(20),
    background varchar(100),
    hit_points integer,
    armor_class integer,
    strength integer,
    dexterity integer,
    constitution integer,
    intelligence integer,
    wisdom integer,
    charisma integer
);

CREATE table abilities (
    ability_id primary key,
    character_id (Foreign Key referencing the Characters table)
    name varchar(100),
    description varchar(1000)
);

CREATE table items (
    item_id primary key,
    character_id (Foreign Key referencing the Characters table)
    name varchar(1000),
    description varchar(2500),
    type varchar(100),
    rarity varchar(100),
    value integer,
    properties varchar(2500)
);

CREATE table spells (
    spell_id primary key,
    name varchar(100),
    level integer,
    school varchar(100),
    casting_time integer,
    range integer,
    components varchar(100),
    duration varchar(100),
    description varchar(2500)
)