class Room {
  constructor(name) {
    this._name = name;
    this._description = "";
    this._linkedRooms = {};
    this._character = "";
    this._items = [];
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get character() {
    return this._character;
  }

  get items() {
    return this._items;
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
      alert("Description is too short.");
      return;
    }
    this._description = value;
  }

  set character(value) {
    this._character = value;
  }

  addItem(item) {
    this._items.push(item);
  }

  removeItem(item) {
    const index = this._items.indexOf(item);
    if (index > -1) {
      this._items.splice(index, 1);
    }
  }

  describe() {
    let description = "Looking around the " + this._name + " you can see " + this._description;
    
    if (this._items.length > 0) {
      description += "<br>You see the following items:";
      this._items.forEach(item => {
        description += "<br>- " + item.name + ": " + item.description;
      });
    }
    
    return description;
  }

  linkRoom(direction, roomToLink) {
    this._linkedRooms[direction] = roomToLink;
  }

  getDetails() {
    const entries = Object.entries(this._linkedRooms);
    let details = []
    for (const [direction, room] of entries) {
      let text = " The " + room._name + " is to the " + direction;
      details.push(text);
    }
    return details;
  }

  move(direction) {
    if (direction in this._linkedRooms) {
      return this._linkedRooms[direction];
    } else {
      alert("You can't go that way");
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
    this._description = value;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

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
  describe() {
    return "You have met " + this._name + ", " + this._name + " is " + this._description;
  }

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

  fight(item) {
    return item.name.toLowerCase().replace(/\s+/g, '_') === this._weakness;
  }
}

// Create rooms
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

// Link rooms
CastleEntrance.linkRoom("north", GreatHall);
GreatHall.linkRoom("south", CastleEntrance);
GreatHall.linkRoom("west", ThroneRoom);
ThroneRoom.linkRoom("east", GreatHall);
ThroneRoom.linkRoom("south", Dungeon);
Dungeon.linkRoom("north", ThroneRoom);
Dungeon.linkRoom("east", TreasureRoom);
TreasureRoom.linkRoom("west", Dungeon);

// Create characters
const Guard = new Character("Guard");
Guard.description = "a heavily armored knight standing watch";
Guard.conversation = "Greetings traveler. The throne room is off limits without the royal seal. Rumor has it the seal was hidden somewhere in the castle after the last king's passing. Be careful though, the castle is not as empty as it seems.";

const Blacksmith = new Character("Blacksmith");
Blacksmith.description = "an old dwarf working at the forge";
Blacksmith.conversation = "I can forge you a weapon, but you'll need to bring me some materials.";

const Wizard = new Character("Wizard");
Wizard.description = "an ancient wizard in flowing robes";
Wizard.conversation = "The castle is cursed! You'll need powerful magic to break the spell.";

// Create enemies
const SkeletonWarrior = new Enemy("Skeleton Warrior");
SkeletonWarrior.description = "a skeletal warrior wielding a rusted sword";
SkeletonWarrior.conversation = "The living shall not pass!";
SkeletonWarrior.weakness = "holy_sword";

const Dragon = new Enemy("Dragon");
Dragon.description = "a massive red dragon guarding the treasure";
Dragon.conversation = "You dare challenge me, mortal?";
Dragon.weakness = "dragon_slayer";

// Create items
const HolySword = new Item("Holy Sword");
HolySword.description = "a gleaming sword imbued with divine power";

const DragonSlayer = new Item("Dragon Slayer");
DragonSlayer.description = "a massive sword forged specifically to slay dragons";

const RoyalSeal = new Item("Royal Seal");
RoyalSeal.description = "the official seal of the royal family";

// Place characters
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
  
  textarea.innerHTML = "";
  userentry.innerHTML = "";
  
  textarea.innerHTML = room.describe();
  
  const details = room.getDetails();
  details.forEach(detail => {
    textarea.innerHTML += detail;
  });
  
  if (room.character) {
    textarea.innerHTML += "<br>" + room.character.describe();
    
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
  
  if (room.items.length > 0) {
    room.items.forEach(item => {
      const takeButton = document.createElement("button");
      takeButton.innerHTML = "Take " + item.name;
      takeButton.onclick = function() { takeItem(item, room); };
      userentry.appendChild(takeButton);
    });
  }
  
  const directions = ["north", "south", "east", "west"];
  directions.forEach(direction => {
    if (direction in room._linkedRooms) {
      const button = document.createElement("button");
      button.innerHTML = "Go " + direction;
      button.onclick = function() { move(direction); };
      userentry.appendChild(button);
    }
  });
  
  const inventoryButton = document.createElement("button");
  inventoryButton.innerHTML = "Check Inventory";
  inventoryButton.onclick = displayInventory;
  userentry.appendChild(inventoryButton);
}

function move(direction) {
  const newRoom = currentRoom.move(direction);
  if (newRoom !== currentRoom) {
    currentRoom = newRoom;
    displayRoomInfo(currentRoom);
  }
}

function displayInventory() {
  const textarea = document.getElementById("textarea");
  const userentry = document.getElementById("userentry");
  
  textarea.innerHTML = "";
  userentry.innerHTML = "";
  
  if (inventory.length === 0) {
    textarea.innerHTML = "Your inventory is empty.";
  } else {
    textarea.innerHTML = "Inventory:<br>";
    inventory.forEach(item => {
      textarea.innerHTML += "- " + item.name + ": " + item.description + "<br>";
    });
  }
  
  const returnButton = document.createElement("button");
  returnButton.innerHTML = "Return to Game";
  returnButton.onclick = function() { displayRoomInfo(currentRoom); };
  userentry.appendChild(returnButton);
}

function fightEnemy(enemy) {
  const textarea = document.getElementById("textarea");
  const userentry = document.getElementById("userentry");
  
  textarea.innerHTML = "";
  userentry.innerHTML = "";
  
  const hasItem = inventory.some(item => {
    console.log("Checking item:", item.name);
    console.log("Converted item name:", item.name.toLowerCase().replace(/\s+/g, '_'));
    console.log("Enemy weakness:", enemy.weakness);
    return item.name.toLowerCase().replace(/\s+/g, '_') === enemy.weakness;
  });
  
  if (hasItem) {
    textarea.innerHTML = "You defeated the " + enemy.name + " using the " + enemy.weakness.replace(/_/g, ' ') + "!";
    currentRoom.character = null;
    
    if (enemy.name === "Dragon") {
      textarea.innerHTML += "<br><br>Congratulations! You have defeated the dragon and won the game!";
    }
  } else {
    textarea.innerHTML = "You were defeated by the " + enemy.name + "! Game Over.";
  }
  
  const restartButton = document.createElement("button");
  restartButton.innerHTML = "Restart Game";
  restartButton.onclick = startGame;
  userentry.appendChild(restartButton);
}

function talkToCharacter(character) {
  const textarea = document.getElementById("textarea");
  const userentry = document.getElementById("userentry");
  
  textarea.innerHTML = "";
  userentry.innerHTML = "";
  
  const hasSeal = inventory.some(item => {
    return item.name.toLowerCase() === "royal seal";
  });
  
  if (character.name === "Guard") {
    if (hasSeal) {
      textarea.innerHTML = "The Guard says: 'Ah, you have the Royal Seal! You are indeed worthy to enter the throne room. I've also unlocked the armory for you - you'll need proper weapons to face what lies ahead.'";
      
      // Link the Armory only after getting the Royal Seal
      GreatHall.linkRoom("east", Armory);
      Armory.linkRoom("west", GreatHall);
      
      const proceedButton = document.createElement("button");
      proceedButton.innerHTML = "Proceed to Throne Room";
      proceedButton.onclick = function() { 
        for (const direction in currentRoom._linkedRooms) {
          const room = currentRoom._linkedRooms[direction];
          if (room.name === "Throne Room") {
            currentRoom = room;
            displayRoomInfo(currentRoom);
            return;
          }
        }
        textarea.innerHTML += "<br>Error: Could not find the throne room!";
      };
      userentry.appendChild(proceedButton);
    } else {
      textarea.innerHTML = character.converse();
    }
  } else {
    textarea.innerHTML = character.converse();
  }
  
  const returnButton = document.createElement("button");
  returnButton.innerHTML = "Return to Game";
  returnButton.onclick = function() { displayRoomInfo(currentRoom); };
  userentry.appendChild(returnButton);
}

function takeItem(item, room) {
  inventory.push(item);
  room.removeItem(item);
  const textarea = document.getElementById("textarea");
  textarea.innerHTML = "You picked up the " + item.name + ".";
  displayRoomInfo(currentRoom);
}

function startGame() {
  // Clear all rooms
  CastleEntrance.items = [];
  GreatHall.items = [];
  Armory.items = [];
  ThroneRoom.items = [];
  Dungeon.items = [];
  TreasureRoom.items = [];

  // Add items to their respective rooms
  Armory.addItem(HolySword);
  Armory.addItem(DragonSlayer);
  ThroneRoom.addItem(RoyalSeal);

  // Reset room links (without Armory initially)
  CastleEntrance.linkRoom("north", GreatHall);
  GreatHall.linkRoom("south", CastleEntrance);
  GreatHall.linkRoom("west", ThroneRoom);
  ThroneRoom.linkRoom("east", GreatHall);
  ThroneRoom.linkRoom("south", Dungeon);
  Dungeon.linkRoom("north", ThroneRoom);
  Dungeon.linkRoom("east", TreasureRoom);
  TreasureRoom.linkRoom("west", Dungeon);

  currentRoom = CastleEntrance;
  inventory = [];
  displayRoomInfo(currentRoom);
  
  document.getElementById("buttonarea").style.display = "none";
}
