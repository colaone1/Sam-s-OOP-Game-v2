class Room {
  constructor(name) {
    this._name = name;
    this._description = "";
    this._linkedRooms = {};
    this._character = "";
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get character() {
    return this._character
  }

  set name(value) {
    if (value.length < 4) {
      alert("Name is too short.");
      return;
    }
    this._name = value;
  }

  set description(value) {
    if (value.length < 4) {
      alert("description is too short.");
      return;
    }
    this._description = value;
  }

  set character(value) {
    this._character = value;
  }

  /**
   * a method to produce friendly room description
   * 
   * @returns {string} description of the room
   * @author Neil Bizzell
   * @version 1.0
   */
  describe() {
    return "Looking around the " + this._name + " you can see " + this._description;
  }

  /**
  * a method to add rooms to link rooms to this one
  * it does this by adding them to _linkedRooms
  * 
  * @param {string} direction the direction the other rooom is from this one
  * @param {object} roomToLink the room that is in that direction
  * @author Neil Bizzell
  * @version 1.0
  */
  linkRoom(direction, roomToLink) {
    this._linkedRooms[direction] = roomToLink;
  }

  /**
   * a method to produce friendly description of linked rooms
   * 
   * @returns {array} descriptions of what rooms are in which direction
   * @author Neil Bizzell
   * @version 1.0
   */
  getDetails() {
    const entries = Object.entries(this._linkedRooms);
    let details = []
    for (const [direction, room] of entries) {
      let text = " The " + room._name + " is to the " + direction;
      details.push(text);
    }
    return details;
  }

  /**
   * a method to move the adventurer to a new room
   * 
   * @param {string} direction the direction in which to move
   * @returns {object} the room moved to 
   * @author Neil Bizzell
   * @version 1.1
   */
  //method to move to a new room
  move(direction) {
    if (direction in this._linkedRooms) {
      return this._linkedRooms[direction];
    } else {
      alert("You can't go that way",);
      alert(this._name)
      return this;
    }
  }
}

class Item {
  constructor(name) {
    this._name = name,
      this._description = ""
  }

  set name(value) {
    if (value.length < 4) {
      alert("Name is too short.");
      return;
    }
    this._name = value;
  }

  set description(value) {
    if (value.length < 4) {
      alert("Decription is too short.");
      return;
    }
    this._name = value;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  /**
   * a method to produce friendly item description
   * 
   * @returns {string} description of the item
   * @author Neil Bizzell
   * @version 1.0
   */
  describe() {
    return "The " + this._name + " is " + this._description;
  }


}

class Character {
  constructor(name) {
    this._name = name,
      this._description = ""
    this._conversation = ""
  }
  set name(value) {
    if (value.length < 4) {
      alert("Name is too short.");
      return;
    }
    this._name = value;
  }

  set description(value) {
    if (value.length < 4) {
      alert("Decription is too short.");
      return;
    }
    this._description = value;
  }

  set conversation(value) {
    if (value.length < 4) {
      alert("conversation is too short.");
      return;
    }
    this._conversation = value;
  }
  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get conversation() {
    return this._conversation;
  }
  /**
   * a method to produce friendly character description
   * 
   * @returns {string} description of the character
   * @author Neil Bizzell
   * @version 1.0
   */
  describe() {
    return "You have met " + this._name + ", " + this._name + " is " + this._description;
  }

  /**
   * a method to produce friendly conversation text
   * 
   * @returns {string} the conversation text
   * @author Neil Bizzell
   * @version 1.0
   */
  converse() {
    return this._name + " says " + "'" + this._conversation + "'";
  }
}

class Enemy extends Character {
  constructor(name) {
    super(name);
    this._weakness = "";
  }

  set weakness(value) {
    if (value.length < 4) {
      alert("Decription is too short.");
      return;
    }
    this._weakness = value;
  }

  /**
   * 
   * a method to determine the reult of fighting an enemy
   * 
   * @param {string} item the item used to fight the enemy 
   * @returns {boolean} the result of the fight true = win, falese = loose
   * @author Neil Bizzell
   * @version 1.0
   */
  fight(item) {
    if (item = this_weakness) {
      return true;
    } else {
      return false;
    }
  }

}

//create the indiviual room objects and add their descriptions
const CastleEntrance = new Room("Castle Entrance");
CastleEntrance.description = "a grand entrance hall with towering stone walls and ancient tapestries. A large wooden door stands before you.";
const GreatHall = new Room("Great Hall");
GreatHall.description = "a vast hall with a long banquet table. The walls are adorned with weapons and shields.";
const Armory = new Room("Armory");
Armory.description = "a room filled with weapons and armor. Dust covers most of the equipment.";
const ThroneRoom = new Room("Throne Room");
ThroneRoom.description = "an opulent room with a golden throne at its center. The air feels heavy with ancient power.";
const Dungeon = new Room("Dungeon");
Dungeon.description = "a dark, damp room with cells lining the walls. The sound of dripping water echoes through the chamber.";
const TreasureRoom = new Room("Treasure Room");
TreasureRoom.description = "a hidden chamber filled with gold, jewels, and ancient artifacts.";

//link the rooms together
CastleEntrance.linkRoom("north", GreatHall);
GreatHall.linkRoom("south", CastleEntrance);
GreatHall.linkRoom("east", Armory);
GreatHall.linkRoom("west", ThroneRoom);
Armory.linkRoom("west", GreatHall);
ThroneRoom.linkRoom("east", GreatHall);
ThroneRoom.linkRoom("south", Dungeon);
Dungeon.linkRoom("north", ThroneRoom);
Dungeon.linkRoom("east", TreasureRoom);
TreasureRoom.linkRoom("west", Dungeon);

//create characters
const Guard = new Character("Guard");
Guard.description = "a heavily armored knight standing watch";
Guard.conversation = "Halt! You need the royal seal to enter the throne room.";

const Blacksmith = new Character("Blacksmith");
Blacksmith.description = "an old dwarf working at the forge";
Blacksmith.conversation = "I can forge you a weapon, but you'll need to bring me some materials.";

const Wizard = new Character("Wizard");
Wizard.description = "an ancient wizard in flowing robes";
Wizard.conversation = "The castle is cursed! You'll need powerful magic to break the spell.";

//create enemies
const SkeletonWarrior = new Enemy("Skeleton Warrior");
SkeletonWarrior.description = "a skeletal warrior wielding a rusted sword";
SkeletonWarrior.conversation = "The living shall not pass!";
SkeletonWarrior.weakness = "holy_sword";

const Dragon = new Enemy("Dragon");
Dragon.description = "a massive red dragon guarding the treasure";
Dragon.conversation = "You dare challenge me, mortal?";
Dragon.weakness = "dragon_slayer";

//create items
const HolySword = new Item("Holy Sword");
HolySword.description = "a gleaming sword imbued with divine power";

const DragonSlayer = new Item("Dragon Slayer");
DragonSlayer.description = "a massive sword forged specifically to slay dragons";

const RoyalSeal = new Item("Royal Seal");
RoyalSeal.description = "the official seal of the royal family";

//place characters and items in rooms
GreatHall.character = Guard;
Armory.character = Blacksmith;
ThroneRoom.character = Wizard;
Dungeon.character = SkeletonWarrior;
TreasureRoom.character = Dragon;

let currentRoom = null;
let inventory = [];

function displayRoomInfo(room) {
  const textarea = document.getElementById("textarea");
  const userentry = document.getElementById("userentry");
  
  // Clear previous content
  textarea.innerHTML = "";
  userentry.innerHTML = "";
  
  // Display room description
  textarea.innerHTML = room.describe();
  
  // Display room connections
  const details = room.getDetails();
  details.forEach(detail => {
    textarea.innerHTML += detail;
  });
  
  // Display character if present
  if (room.character) {
    textarea.innerHTML += "<br>" + room.character.describe();
    textarea.innerHTML += "<br>" + room.character.converse();
    
    // Add interaction buttons for characters
    if (room.character instanceof Enemy) {
      const fightButton = document.createElement("button");
      fightButton.innerHTML = "Fight " + room.character.name;
      fightButton.onclick = function() { fightEnemy(room.character); };
      userentry.appendChild(fightButton);
    } else {
      const talkButton = document.createElement("button");
      talkButton.innerHTML = "Talk to " + room.character.name;
      talkButton.onclick = function() { talkToCharacter(room.character); };
      userentry.appendChild(talkButton);
    }
  }
  
  // Add movement buttons
  const directions = ["north", "south", "east", "west"];
  directions.forEach(direction => {
    if (direction in room._linkedRooms) {
      const button = document.createElement("button");
      button.innerHTML = "Go " + direction;
      button.onclick = function() { move(direction); };
      userentry.appendChild(button);
    }
  });
  
  // Add inventory button
  const inventoryButton = document.createElement("button");
  inventoryButton.innerHTML = "Check Inventory";
  inventoryButton.onclick = displayInventory;
  userentry.appendChild(inventoryButton);
}

function move(direction) {
  currentRoom = currentRoom.move(direction);
  displayRoomInfo(currentRoom);
}

function displayInventory() {
  const textarea = document.getElementById("textarea");
  if (inventory.length === 0) {
    textarea.innerHTML = "Your inventory is empty.";
  } else {
    textarea.innerHTML = "Inventory:<br>";
    inventory.forEach(item => {
      textarea.innerHTML += "- " + item.name + ": " + item.description + "<br>";
    });
  }
}

function fightEnemy(enemy) {
  const textarea = document.getElementById("textarea");
  let hasWeakness = false;
  
  inventory.forEach(item => {
    if (item.name.toLowerCase() === enemy.weakness) {
      hasWeakness = true;
    }
  });
  
  if (hasWeakness) {
    textarea.innerHTML = "You defeated the " + enemy.name + " using the " + enemy.weakness + "!";
    currentRoom.character = null;
    
    if (enemy.name === "Dragon") {
      textarea.innerHTML += "<br><br>Congratulations! You have defeated the dragon and won the game!";
      document.getElementById("userentry").innerHTML = "";
    }
  } else {
    textarea.innerHTML = "You were defeated by the " + enemy.name + "! Game Over.";
    document.getElementById("userentry").innerHTML = "";
  }
}

function talkToCharacter(character) {
  const textarea = document.getElementById("textarea");
  textarea.innerHTML = character.converse();
  
  if (character.name === "Blacksmith" && !inventory.some(item => item.name === "Dragon Slayer")) {
    const forgeButton = document.createElement("button");
    forgeButton.innerHTML = "Ask to forge Dragon Slayer";
    forgeButton.onclick = function() { 
      if (inventory.some(item => item.name === "Holy Sword")) {
        inventory.push(DragonSlayer);
        textarea.innerHTML = "The blacksmith forges the Dragon Slayer for you!";
      } else {
        textarea.innerHTML = "You need a Holy Sword to forge the Dragon Slayer.";
      }
    };
    document.getElementById("userentry").appendChild(forgeButton);
  }
}

function startGame() {
  currentRoom = CastleEntrance;
  displayRoomInfo(currentRoom);
}
