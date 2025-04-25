/**
 * Represents a room in the game world
 */
class Room {
  constructor(name) {
    this._name = name;
    this._description = "";
    this._linkedRooms = {};
    this._character = null;
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

  set description(description) {
    this._description = description;
  }

  set character(character) {
    this._character = character;
  }

  set items(items) {
    this._items = items;
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

  /**
   * Creates a connection to another room in the specified direction
   * @param {string} direction - The direction of the connection (north, south, east, west)
   * @param {Room} roomToLink - The room to connect to
   */
  linkRoom(direction, roomToLink) {
    this._linkedRooms[direction] = roomToLink;
    console.log(`Linking ${this._name} to ${roomToLink._name} in direction ${direction}`);
  }

  /**
   * Gets a description of available exits from the room
   * @returns {string[]} Array of exit descriptions
   */
  getDetails() {
    const entries = Object.entries(this._linkedRooms);
    let details = [];
    for (const [direction, room] of entries) {
      let text = "<br>The " + room._name + " is to the " + direction;
      details.push(text);
    }
    return details;
  }
}

/**
 * Represents an item that can be collected and used
 */
class Item {
  constructor(name) {
    this._name = name;
    this._description = "";
  }

  get name() {
    return this._name;
  }

  set description(description) {
    this._description = description;
  }

  get description() {
    return this._description;
  }
}

/**
 * Base class for NPCs and enemies
 */
class Character {
  constructor(name) {
    this._name = name;
    this._description = "";
    this._conversation = "";
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  set conversation(conversation) {
    this._conversation = conversation;
  }

  get conversation() {
    return this._conversation;
  }

  describe() {
    return "You have met " + this._name + ", " + this._description;
  }

  converse() {
    return this._name + " says " + "'" + this._conversation + "'";
  }
}

/**
 * Enemy class with weakness mechanic for combat
 */
class Enemy extends Character {
  constructor(name) {
    super(name);
    this._weakness = "";
  }

  set weakness(weakness) {
    this._weakness = weakness;
  }

  get weakness() {
    return this._weakness;
  }

  fight(item) {
    return item.name.toLowerCase().replace(/\s+/g, '_') === this._weakness;
  }
}

// Create rooms
const CastleEntrance = new Room("Castle Entrance");
CastleEntrance.description = "A grand entrance hall with towering stone walls and ancient tapestries. A large wooden door stands before you.";

const GreatHall = new Room("Great Hall");
GreatHall.description = "A vast hall with a long banquet table. The walls are adorned with weapons and shields.";

const Armory = new Room("Armory");
Armory.description = "A room filled with weapons and armor. Dust covers most of the equipment.";

const ThroneRoom = new Room("Throne Room");
ThroneRoom.description = "An opulent room with a golden throne at its center. The air feels heavy with ancient power.";

const Dungeon = new Room("Dungeon");
Dungeon.description = "A dark, damp room with cells lining the walls. The sound of dripping water echoes through the chamber.";

const TreasureRoom = new Room("Treasure Room");
TreasureRoom.description = "A hidden chamber filled with gold, jewels, and ancient artifacts.";

const WizardsTower = new Room("Wizard's Tower");
WizardsTower.description = "A tall tower filled with magical artifacts and ancient tomes.";

// Create characters
const Guard = new Character("Guard");
Guard.description = "A heavily armored knight standing watch";
Guard.conversation = "Halt, traveler! The throne room is forbidden to all without the royal seal. Legend tells of a seal hidden within these very walls, a relic of the last true king. But beware - the castle is not as abandoned as it seems. Dark forces stir in the depths...";

const Blacksmith = new Character("Blacksmith");
Blacksmith.description = "An old dwarf working at the forge";
Blacksmith.conversation = "Ah, a visitor! I haven't seen a living soul in these halls for years. I see you've found the Royal Seal - that means you're worthy to be here. The armory has two powerful weapons: the Holy Sword for dealing with undead creatures, and the Dragon Slayer for facing the mighty dragon. Take what you need.";

const Wizard = new Character("Wizard");
Wizard.description = "An ancient wizard in flowing robes";
Wizard.conversation = "The castle is cursed, my friend. A dark magic lingers in these halls. The skeleton warrior in the dungeon and the dragon in the treasure room are but symptoms of a greater evil. You'll need powerful weapons to face them - the holy sword for the undead, and the dragon slayer for the beast. Both can be found in the armory, but you'll need the royal seal to enter.";

// Create enemies
const SkeletonWarrior = new Enemy("Skeleton Warrior");
SkeletonWarrior.description = "A skeletal warrior wielding a rusted sword";
SkeletonWarrior.conversation = "The living shall not pass! I am bound to this place by dark magic, cursed to guard these halls for eternity. Only the holy sword can break my curse and send me to my final rest.";
SkeletonWarrior.weakness = "holy_sword";

const Dragon = new Enemy("Dragon");
Dragon.description = "A massive red dragon guarding the treasure";
Dragon.conversation = "You dare challenge me, mortal? I am the last of my kind, bound to guard this treasure until the end of days. The dragon slayer is the only weapon that can pierce my scales. Do you have what it takes to face me?";
Dragon.weakness = "dragon_slayer";

// Create items
const HolySword = new Item("Holy Sword");
HolySword.description = "A gleaming sword imbued with divine power";

const DragonSlayer = new Item("Dragon Slayer");
DragonSlayer.description = "A massive sword forged specifically to slay dragons";

const RoyalSeal = new Item("Royal Seal");
RoyalSeal.description = "The official seal of the royal family";

// Game state variables
let currentRoom = null;
let inventory = [];
let defeatedEnemies = [];
let gameStarted = false;

// UI Helper Functions
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showHelp() {
    const helpContent = document.getElementById('help-content');
    helpContent.style.display = 'block';
    helpContent.setAttribute('aria-hidden', 'false');
}

function hideHelp() {
    const helpContent = document.getElementById('help-content');
    helpContent.style.display = 'none';
    helpContent.setAttribute('aria-hidden', 'true');
    
    // After hiding help, focus on the first available button
    const buttons = Array.from(document.querySelectorAll('button:not([style*="display: none"])'));
    if (buttons.length > 0) {
        // Try to find the previously focused button
        const previouslyFocused = buttons.find(button => 
            button.innerHTML === "Begin Adventure" || 
            button.innerHTML.startsWith("Go ") ||
            button.innerHTML === "Check Inventory" ||
            button.innerHTML.startsWith("Talk to ") ||
            button.innerHTML.startsWith("Fight ") ||
            button.innerHTML.startsWith("Take ")
        );
        
        // Focus either the previously focused button or the first available button
        if (previouslyFocused) {
            previouslyFocused.focus();
        } else {
            buttons[0].focus();
        }
    }
}

// Add the keyboard navigation handler
function handleGlobalKeyNavigation(e) {
    // Get all visible buttons in the current view
    const buttons = Array.from(document.querySelectorAll('button:not([style*="display: none"])'));
    if (buttons.length === 0) return;

    // Find the currently focused button or get the first one
    let currentIndex = buttons.findIndex(button => button === document.activeElement);
    if (currentIndex === -1) currentIndex = 0;

    switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % buttons.length;
            buttons[nextIndex].focus();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            buttons[prevIndex].focus();
            break;
        case 'Enter':
        case ' ':
            if (document.activeElement.tagName === 'BUTTON') {
                // Let the button's own click handler deal with it
                return;
            } else if (buttons.length > 0) {
                e.preventDefault();
                buttons[0].focus();
            }
            break;
    }
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Help button functionality
    const helpButton = document.getElementById('help-button');
    const closeHelpButton = document.getElementById('close-help');
    
    helpButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showHelp();
    });
    
    closeHelpButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hideHelp();
    });
    
    // Add keyboard event listener for closing help with Enter/Space
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && 
            document.getElementById('help-content').style.display === 'block') {
            e.preventDefault();
            e.stopPropagation();
            hideHelp();
        }
    });
    
    // Hide game form initially
    document.getElementById("gameform").style.display = "none";
    
    // Ensure buttonarea exists
    let buttonArea = document.getElementById("buttonarea");
    if (!buttonArea) {
        const gameContainer = document.querySelector('.game-container');
        buttonArea = document.createElement('div');
        buttonArea.id = 'buttonarea';
        gameContainer.appendChild(buttonArea);
    }
    
    // Update the welcome text
    const welcomeText = document.getElementById("textarea");
    if (welcomeText) {
        welcomeText.innerHTML = `Welcome to Castle Adventure!<br>
You find yourself at the entrance of an ancient castle. Clear the dungeon of all enemies to win!<br><br>

Controls:<br>
    → Use arrow keys to navigate buttons<br>
        → Space/Enter to activate buttons<br>
            → Mouse clicks also work<br>
                → Tab to cycle through buttons<br><br>

Need help? Click the ? icon or use the arrow keys to navigate to it.<br><br>

Press Space/Enter to begin your adventure.`;
    }
    
    // Create and show start button
    const startButton = document.createElement("button");
    startButton.id = "start-button";
    startButton.innerHTML = "Begin Adventure";
    startButton.setAttribute("aria-label", "Begin your adventure");
    startButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        startGame();
    });
    
    buttonArea.innerHTML = '';
    buttonArea.appendChild(startButton);
    startButton.focus();
    
    // Add the keyboard navigation back
    document.addEventListener('keydown', handleGlobalKeyNavigation);
});

// Modify existing functions to use loading indicator
function displayRoomInfo(room) {
    showLoading();
    setTimeout(() => {
        const textarea = document.getElementById("textarea");
        const userentry = document.getElementById("userentry");
        
        textarea.innerHTML = "";
        userentry.innerHTML = "";
        
        textarea.innerHTML = room.describe();
        textarea.setAttribute("aria-live", "polite");
        
        const details = room.getDetails();
        details.forEach(detail => {
            textarea.innerHTML += detail;
        });
        
        let buttons = [];
        
        // Add directional buttons first
        const directions = ["north", "south", "east", "west"];
        directions.forEach(direction => {
            if (direction in room._linkedRooms) {
                const button = document.createElement("button");
                button.innerHTML = "Go " + direction;
                button.setAttribute("aria-label", "Move " + direction);
                button.setAttribute("tabindex", "0");
                button.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    move(direction);
                };
                userentry.appendChild(button);
                buttons.push(button);
            }
        });
        
        // Add character interactions
        if (room.character) {
            textarea.innerHTML += "<br>" + room.character.describe();
            
            const talkButton = document.createElement("button");
            talkButton.innerHTML = "Talk to " + room.character.name;
            talkButton.setAttribute("aria-label", "Talk to " + room.character.name);
            talkButton.setAttribute("tabindex", "0");
            talkButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                talkToCharacter(room.character);
            };
            userentry.appendChild(talkButton);
            buttons.push(talkButton);
            
            if (room.character instanceof Enemy) {
                const fightButton = document.createElement("button");
                fightButton.innerHTML = "Fight " + room.character.name;
                fightButton.setAttribute("aria-label", "Fight " + room.character.name);
                fightButton.setAttribute("tabindex", "0");
                fightButton.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fightEnemy(room.character);
                };
                userentry.appendChild(fightButton);
                buttons.push(fightButton);
            }
        }
        
        if (room.items.length > 0) {
            room.items.forEach(item => {
                const takeButton = document.createElement("button");
                takeButton.innerHTML = "Take " + item.name;
                takeButton.setAttribute("aria-label", "Take " + item.name);
                takeButton.setAttribute("tabindex", "0");
                takeButton.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    takeItem(item, room);
                };
                userentry.appendChild(takeButton);
                buttons.push(takeButton);
            });
        }
        
        const inventoryButton = document.createElement("button");
        inventoryButton.innerHTML = "Check Inventory";
        inventoryButton.setAttribute("aria-label", "Check your inventory");
        inventoryButton.setAttribute("tabindex", "0");
        inventoryButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            displayInventory();
        };
        userentry.appendChild(inventoryButton);
        buttons.push(inventoryButton);
        
        // Focus the first button
        if (buttons.length > 0) {
            buttons[0].focus();
        }
        
        hideLoading();
    }, 500);
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
    returnButton.setAttribute("aria-label", "Return to game");
    returnButton.setAttribute("tabindex", "0");
    returnButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        displayRoomInfo(currentRoom);
    };
    userentry.appendChild(returnButton);
    // Focus the return button immediately
    returnButton.focus();
}

// Helper function to reset game to start screen
function resetToStartScreen() {
    showLoading();
    
    // Reset game state
    currentRoom = null;
    inventory = [];
    defeatedEnemies = [];
    gameStarted = false;
    
    // Hide game form
    document.getElementById("gameform").style.display = "none";
    
    // Update welcome text
    const welcomeText = document.getElementById("textarea");
    welcomeText.innerHTML = `Welcome to Castle Adventure!<br>
You find yourself at the entrance of an ancient castle. Clear the dungeon of all enemies to win!<br><br>

Controls:<br>
    → Use arrow keys to navigate buttons<br>
        → Space/Enter to activate buttons<br>
            → Mouse clicks also work<br>
                → Tab to cycle through buttons<br><br>

Need help? Click the ? icon or use the arrow keys to navigate to it.<br><br>

Press Space/Enter to begin your adventure.`;
    
    setTimeout(() => {
        // Show and update button area
        const buttonArea = document.getElementById("buttonarea");
        if (!buttonArea) {
            // If buttonarea doesn't exist, create it
            const gameContainer = document.querySelector('.game-container');
            const newButtonArea = document.createElement('div');
            newButtonArea.id = 'buttonarea';
            gameContainer.appendChild(newButtonArea);
        }
        
        const startButton = document.createElement("button");
        startButton.id = "start-button";
        startButton.innerHTML = "Begin Adventure";
        startButton.setAttribute("aria-label", "Begin your adventure");
        startButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            startGame();
        });
        
        // Clear and show button area
        buttonArea.style.display = "block";
        buttonArea.innerHTML = '';
        buttonArea.appendChild(startButton);
        
        // Hide loading and focus button
        hideLoading();
        startButton.focus();
    }, 500);
}

function fightEnemy(enemy) {
    const textarea = document.getElementById("textarea");
    const userentry = document.getElementById("userentry");
    
    textarea.innerHTML = "";
    userentry.innerHTML = "";
    
    const hasItem = inventory.some(item => enemy.fight(item));
    
    if (hasItem) {
        textarea.innerHTML = "You defeated the " + enemy.name + " using the " + enemy.weakness.replace(/_/g, ' ') + "!";
        currentRoom.character = null;
        defeatedEnemies.push(enemy.name);
        
        if (defeatedEnemies.includes("Skeleton Warrior") && defeatedEnemies.includes("Dragon")) {
            textarea.innerHTML += "<br><br>Congratulations! You have defeated all the enemies and won the game!";
            const restartButton = document.createElement("button");
            restartButton.innerHTML = "Restart Game";
            restartButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                resetToStartScreen();
            };
            userentry.appendChild(restartButton);
            restartButton.focus();
        } else {
            const continueButton = document.createElement("button");
            continueButton.innerHTML = "Continue";
            continueButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                displayRoomInfo(currentRoom);
            };
            userentry.appendChild(continueButton);
            continueButton.focus();
        }
    } else {
        textarea.innerHTML = "You were defeated by the " + enemy.name + "! Game Over.";
        const restartButton = document.createElement("button");
        restartButton.innerHTML = "Restart Game";
        restartButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            resetToStartScreen();
        };
        userentry.appendChild(restartButton);
        restartButton.focus();
    }
}

function unlockThroneRoom() {
    // Link the Throne Room and Dungeon after getting the Royal Seal
    GreatHall.linkRoom("west", ThroneRoom);
    ThroneRoom.linkRoom("east", GreatHall);
    ThroneRoom.linkRoom("south", Dungeon);
    Dungeon.linkRoom("north", ThroneRoom);
    // Connect Dungeon to Treasure Room
    Dungeon.linkRoom("east", TreasureRoom);
    TreasureRoom.linkRoom("west", Dungeon);
    // Connect Throne Room to Armory
    ThroneRoom.linkRoom("west", Armory);
    Armory.linkRoom("east", ThroneRoom);
}

function talkToCharacter(character) {
    showLoading();
    setTimeout(() => {
        const textarea = document.getElementById("textarea");
        const userentry = document.getElementById("userentry");
        
        textarea.innerHTML = "";
        userentry.innerHTML = "";
        
        if (character.name === "Guard") {
            const hasSeal = inventory.some(item => item.name === "Royal Seal");
            if (hasSeal) {
                textarea.innerHTML = "The Guard says: 'Ah, you have the Royal Seal! You are indeed worthy to enter the throne room. The armory can be accessed through a hidden door in the throne room.'";
                unlockThroneRoom();
                
                const proceedButton = document.createElement("button");
                proceedButton.innerHTML = "Proceed to Throne Room";
                proceedButton.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
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
                proceedButton.focus();
            } else {
                textarea.innerHTML = character.converse();
                addReturnButton(userentry);
            }
        } else if (character.name === "Wizard") {
            const hasSeal = inventory.some(item => item.name === "Royal Seal");
            if (hasSeal) {
                textarea.innerHTML = "The Wizard says: 'Ah, I see you've found the Royal Seal! That is a powerful artifact indeed. Take it to the Guard in the Great Hall - he will grant you access to the throne room. The armory can be accessed through a secret door in the throne room.'";
            } else {
                textarea.innerHTML = character.converse();
            }
            addReturnButton(userentry);
        } else {
            textarea.innerHTML = character.converse();
            addReturnButton(userentry);
        }
        
        hideLoading();
    }, 500);
}

// Helper function to add return button
function addReturnButton(userentry) {
    const returnButton = document.createElement("button");
    returnButton.innerHTML = "Return to Game";
    returnButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        displayRoomInfo(currentRoom);
    };
    userentry.appendChild(returnButton);
    returnButton.focus();
}

function takeItem(item, room) {
  if (!inventory.includes(item)) {
    inventory.push(item);
    const index = room.items.indexOf(item);
    if (index > -1) {
      room.items.splice(index, 1);
    }
    const textarea = document.getElementById("textarea");
    textarea.innerHTML = "You picked up the " + item.name + ".";
    displayRoomInfo(currentRoom);
  }
}

function startGame() {
    // Clear all rooms
    CastleEntrance.items = [];
    GreatHall.items = [];
    Armory.items = [];
    ThroneRoom.items = [];
    Dungeon.items = [];
    TreasureRoom.items = [];
    WizardsTower.items = [];

    // Reset all characters
    GreatHall.character = Guard;
    Armory.character = Blacksmith;
    WizardsTower.character = Wizard;
    Dungeon.character = SkeletonWarrior;
    TreasureRoom.character = Dragon;

    // Add items to their respective rooms
    Armory.addItem(HolySword);
    Armory.addItem(DragonSlayer);
    WizardsTower.addItem(RoyalSeal);

    // Clear all existing room links
    CastleEntrance._linkedRooms = {};
    GreatHall._linkedRooms = {};
    WizardsTower._linkedRooms = {};
    ThroneRoom._linkedRooms = {};
    Armory._linkedRooms = {};
    Dungeon._linkedRooms = {};
    TreasureRoom._linkedRooms = {};

    console.log('Setting up initial room connections...');

    // Set up initial room connections
    // Link Castle Entrance to Great Hall (north-south connection)
    CastleEntrance.linkRoom("north", GreatHall);
    GreatHall.linkRoom("south", CastleEntrance);
    
    // Link Castle Entrance to Wizard's Tower (east-west connection)
    CastleEntrance.linkRoom("east", WizardsTower);
    WizardsTower.linkRoom("west", CastleEntrance);

    console.log('Initial room connections complete');
    console.log('Castle Entrance connections:', Object.keys(CastleEntrance._linkedRooms));
    console.log('Great Hall connections:', Object.keys(GreatHall._linkedRooms));
    console.log('Wizard Tower connections:', Object.keys(WizardsTower._linkedRooms));

    // Set initial room and game state
    currentRoom = CastleEntrance;
    inventory = [];
    defeatedEnemies = [];
    
    // Update UI
    const startButton = document.getElementById("start-button");
    if (startButton) startButton.style.display = "none";
    document.getElementById("gameform").style.display = "block";
    
    // Display initial room
    displayRoomInfo(currentRoom);
}

/**
 * Handles player movement between rooms
 * @param {string} direction - Direction to move (north, south, east, west)
 */
function move(direction) {
    event.preventDefault();
    event.stopPropagation();

    console.log('Moving:', direction);
    console.log('Current room:', currentRoom.name);
    
    const nextRoom = currentRoom._linkedRooms[direction];
    if (nextRoom) {
        currentRoom = nextRoom;
        displayRoomInfo(currentRoom);
    } else {
        handleInvalidMove();
    }
}

/**
 * Handles invalid movement attempts
 */
function handleInvalidMove() {
    const textarea = document.getElementById("textarea");
    const userentry = document.getElementById("userentry");
    
    textarea.innerHTML = "You can't go that way.";
    userentry.innerHTML = "";
    
    const continueButton = document.createElement("button");
    continueButton.innerHTML = "Continue";
    continueButton.setAttribute("aria-label", "Continue exploring");
    continueButton.setAttribute("tabindex", "0");
    continueButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        displayRoomInfo(currentRoom);
    };
    userentry.appendChild(continueButton);
    continueButton.focus();
}
