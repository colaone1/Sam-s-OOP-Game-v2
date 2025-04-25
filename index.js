/**
 * Castle Adventure Game
 * A text-based adventure game with object-oriented design
 * Core game classes and game state management
 */

// ============= Game Classes =============

/**
 * Represents a room in the game world
 * Manages room connections, items, and characters
 */
class Room {
    constructor(name) {
        this._name = name;
        this._description = "";
        this._linkedRooms = {};
        this._character = null;
        this._items = [];
    }

    // Getters and setters
    get name() { return this._name; }
    get description() { return this._description; }
    get character() { return this._character; }
    get items() { return this._items; }

    set description(description) { this._description = description; }
    set character(character) { this._character = character; }
    set items(items) { this._items = items; }

    /**
     * Adds an item to the room's inventory
     * @param {Item} item - The item to add
     */
    addItem(item) {
        this._items.push(item);
    }

    /**
     * Removes an item from the room's inventory
     * @param {Item} item - The item to remove
     */
    removeItem(item) {
        const index = this._items.indexOf(item);
        if (index > -1) {
            this._items.splice(index, 1);
        }
    }

    /**
     * Generates a description of the room and its contents
     * @returns {string} Complete room description
     */
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

    get name() { return this._name; }
    get description() { return this._description; }
    set description(description) { this._description = description; }
}

/**
 * Base class for NPCs and enemies
 * Handles character interactions and dialogue
 */
class Character {
    constructor(name) {
        this._name = name;
        this._description = "";
        this._conversation = "";
    }

    get name() { return this._name; }
    get description() { return this._description; }
    get conversation() { return this._conversation; }
    set conversation(conversation) { this._conversation = conversation; }

    describe() {
        return "You have met " + this._name + ", " + this._description;
    }

    converse() {
        return this._name + " says " + "'" + this._conversation + "'";
    }
}

/**
 * Enemy class with weakness mechanic for combat
 * Extends Character with combat functionality
 */
class Enemy extends Character {
    constructor(name) {
        super(name);
        this._weakness = "";
    }

    get weakness() { return this._weakness; }
    set weakness(weakness) { this._weakness = weakness; }

    /**
     * Checks if the given item can defeat this enemy
     * @param {Item} item - The item to check against enemy's weakness
     * @returns {boolean} True if the item can defeat the enemy
     */
    fight(item) {
        return item.name.toLowerCase().replace(/\s+/g, '_') === this._weakness;
    }
}

// ============= Game State =============

// Game state variables
let currentRoom = null;
let inventory = [];
let defeatedEnemies = [];
let gameStarted = false;

// ============= UI Helper Functions =============

/**
 * Shows the loading indicator
 */
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('loading').classList.add('visible-flex');
}

/**
 * Hides the loading indicator
 */
function hideLoading() {
    document.getElementById('loading').classList.remove('visible-flex');
    document.getElementById('loading').classList.add('hidden');
}

/**
 * Shows the help menu
 */
function showHelp() {
    const helpContent = document.getElementById('help-content');
    helpContent.classList.remove('hidden');
    helpContent.classList.add('visible');
    helpContent.setAttribute('aria-hidden', 'false');
}

/**
 * Hides the help menu and restores focus
 */
function hideHelp() {
    const helpContent = document.getElementById('help-content');
    helpContent.classList.remove('visible');
    helpContent.classList.add('hidden');
    helpContent.setAttribute('aria-hidden', 'true');
    
    // After hiding help, focus on the first available button
    const buttons = Array.from(document.querySelectorAll('button:not(.hidden)'));
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

/**
 * Creates a button element with enhanced styling and accessibility
 */
function createButton(text, onClick, ariaLabel) {
    const button = document.createElement("button");
    button.textContent = text;
    button.onclick = onClick;
    button.className = "game-button";
    
    // Add hover effect class
    button.addEventListener('mouseenter', () => {
        button.classList.add('button-hover');
    });
    button.addEventListener('mouseleave', () => {
        button.classList.remove('button-hover');
    });
    
    // Add focus effect
    button.addEventListener('focus', () => {
        button.classList.add('button-focused');
    });
    button.addEventListener('blur', () => {
        button.classList.remove('button-focused');
    });
    
    if (ariaLabel) {
        button.setAttribute("aria-label", ariaLabel);
    }
    return button;
}

// ============= Game Logic Functions =============

/**
 * Handles keyboard navigation for buttons
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleGlobalKeyNavigation(e) {
    const buttons = Array.from(document.querySelectorAll('button:not(.hidden)'));
    if (buttons.length === 0) return;

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
                return;
            } else if (buttons.length > 0) {
                e.preventDefault();
                buttons[0].focus();
            }
            break;
    }
}

/**
 * Initializes the game world and starts a new game
 */
function startGame(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Initialize rooms and game state
    initializeRooms();
    setupInitialConnections();
    
    // Set initial game state
    currentRoom = CastleEntrance;
    inventory = [];
    defeatedEnemies = [];
    gameStarted = true;
    
    // Update UI
    const buttonArea = document.getElementById("buttonarea");
    buttonArea.classList.add('hidden');
    buttonArea.innerHTML = ''; // Clear the start button
    
    const gameForm = document.getElementById("gameform");
    gameForm.classList.remove('hidden');
    gameForm.classList.add('visible');
    
    const userentry = document.getElementById("userentry");
    userentry.classList.remove('hidden');
    userentry.classList.add('visible');
    userentry.innerHTML = "";
    
    // Display initial room
    displayRoomInfo(currentRoom);
}

/**
 * Initializes all rooms with their properties
 */
function initializeRooms() {
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
}

/**
 * Sets up initial room connections
 */
function setupInitialConnections() {
    // Clear all existing room links
    CastleEntrance._linkedRooms = {};
    GreatHall._linkedRooms = {};
    WizardsTower._linkedRooms = {};
    ThroneRoom._linkedRooms = {};
    Armory._linkedRooms = {};
    Dungeon._linkedRooms = {};
    TreasureRoom._linkedRooms = {};

    // Set up initial room connections
    CastleEntrance.linkRoom("north", GreatHall);
    GreatHall.linkRoom("south", CastleEntrance);
    CastleEntrance.linkRoom("east", WizardsTower);
    WizardsTower.linkRoom("west", CastleEntrance);
}

// ============= Game Objects Initialization =============

// Initialize Rooms
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

// Initialize Characters
const Guard = new Character("Guard");
Guard.description = "A heavily armored knight standing watch";
Guard.conversation = "Halt, traveler! The throne room is forbidden to all without the royal seal. Legend tells of a seal hidden within these very walls, a relic of the last true king. But beware - the castle is not as abandoned as it seems. Dark forces stir in the depths...";

const Blacksmith = new Character("Blacksmith");
Blacksmith.description = "An old dwarf working at the forge";
Blacksmith.conversation = "Ah, a visitor! I haven't seen a living soul in these halls for years. I see you've found the Royal Seal - that means you're worthy to be here. The armory has two powerful weapons: the Holy Sword for dealing with undead creatures, and the Dragon Slayer for facing the mighty dragon. Take what you need.";

const Wizard = new Character("Wizard");
Wizard.description = "An ancient wizard in flowing robes";
Wizard.conversation = "The castle is cursed, my friend. A dark magic lingers in these halls. The skeleton warrior in the dungeon and the dragon in the treasure room are but symptoms of a greater evil. You'll need powerful weapons to face them - the holy sword for the undead, and the dragon slayer for the beast. Both can be found in the armory, but you'll need the royal seal to enter.";

// Initialize Enemies
const SkeletonWarrior = new Enemy("Skeleton Warrior");
SkeletonWarrior.description = "A skeletal warrior wielding a rusted sword";
SkeletonWarrior.conversation = "The living shall not pass! I am bound to this place by dark magic, cursed to guard these halls for eternity. Only the holy sword can break my curse and send me to my final rest.";
SkeletonWarrior.weakness = "holy_sword";

const Dragon = new Enemy("Dragon");
Dragon.description = "A massive red dragon guarding the treasure";
Dragon.conversation = "You dare challenge me, mortal? I am the last of my kind, bound to guard this treasure until the end of days. The dragon slayer is the only weapon that can pierce my scales. Do you have what it takes to face me?";
Dragon.weakness = "dragon_slayer";

// Initialize Items
const HolySword = new Item("Holy Sword");
HolySword.description = "A gleaming sword imbued with divine power";

const DragonSlayer = new Item("Dragon Slayer");
DragonSlayer.description = "A massive sword forged specifically to slay dragons";

const RoyalSeal = new Item("Royal Seal");
RoyalSeal.description = "The official seal of the royal family";

/**
 * Handles player movement between rooms
 * @param {string} direction - Direction to move (north, south, east, west)
 */
function move(direction) {
    event.preventDefault();
    event.stopPropagation();
    
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
    
    textarea.className = "game-text text-center";
    textarea.innerHTML = "You can't go that way.";
    
    const continueButton = createButton("Continue", (e) => {
        e.preventDefault();
        e.stopPropagation();
        displayRoomInfo(currentRoom);
    }, "Continue exploring");
    userentry.appendChild(continueButton);
    continueButton.focus();
}

/**
 * Displays information about the current room and available actions
 * @param {Room} room - The room to display information for
 */
function displayRoomInfo(room) {
    showLoading();
    setTimeout(() => {
        const textarea = document.getElementById("textarea");
        const userentry = document.getElementById("userentry");
        const buttonArea = document.getElementById("buttonarea");
        
        if (gameStarted) {
            buttonArea.classList.add('hidden');
            buttonArea.innerHTML = '';
        }
        
        userentry.innerHTML = "";
        
        // Streamline the content layout
        textarea.className = "game-text text-center themed-background";
        
        // Compact room description
        let description = `<div class="room-header">
            <h2 class="room-title">${room._name}</h2>
            <p class="room-description">${room._description}</p>
        </div>`;
        
        // Combine items and exits in a more compact layout
        let sideInfo = '<div class="side-info">';
        
        // For items, display them inline if in the Armory
        if (room._items.length > 0) {
            if (room._name === "Armory") {
                sideInfo += '<div class="side-section items-list inline">';
                sideInfo += "<h3>Items: ";
                const itemNames = room._items.map(item => item.name).join(', ');
                sideInfo += `${itemNames}</h3>`;
                sideInfo += '</div>';
            } else {
                sideInfo += '<div class="side-section items-list">';
                sideInfo += "<h3>Items:</h3>";
                room._items.forEach(item => {
                    sideInfo += `<div class="item-entry">${item.name}</div>`;
                });
                sideInfo += '</div>';
            }
        }
        
        const details = room.getDetails();
        if (details.length > 0) {
            sideInfo += '<div class="side-section exits-list">';
            sideInfo += "<h3>Exits: ";
            const exitTexts = details.map(detail => 
                detail.replace('<br>The ', '').replace(' is to the ', ' ')
            );
            sideInfo += exitTexts.join(', ');
            sideInfo += '</h3></div>';
        }
        sideInfo += '</div>';
        
        // Add character info if present
        if (room.character) {
            description += `<div class="character-info">
                <p>${room.character.describe()}</p>
            </div>`;
        }
        
        // Combine all content with minimal spacing
        textarea.innerHTML = `
            <div class="game-content">
                <div class="main-content">${description}</div>
                ${sideInfo}
            </div>`;
        
        // Create compact button layout
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'compact-button-grid';
        userentry.appendChild(buttonContainer);
        
        let buttons = [];
        
        // Direction buttons in a tight compass layout
        const directions = ["north", "south", "east", "west"];
        const directionButtons = document.createElement('div');
        directionButtons.className = 'compact-directions';
        directions.forEach(direction => {
            if (direction in room._linkedRooms) {
                const button = createButton("Go " + direction, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    move(direction);
                }, "Move " + direction);
                button.classList.add('direction-button', `direction-${direction}`);
                directionButtons.appendChild(button);
                buttons.push(button);
            }
        });
        buttonContainer.appendChild(directionButtons);
        
        // Action buttons in a compact grid
        const actionButtons = document.createElement('div');
        actionButtons.className = 'compact-actions';
        
        if (room.character) {
            const talkButton = createButton("Talk to " + room.character.name, (e) => {
                e.preventDefault();
                e.stopPropagation();
                talkToCharacter(room.character);
            }, "Talk to " + room.character.name);
            talkButton.classList.add('character-button');
            actionButtons.appendChild(talkButton);
            buttons.push(talkButton);
            
            if (room.character instanceof Enemy) {
                const fightButton = createButton("Fight " + room.character.name, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fightEnemy(room.character);
                }, "Fight " + room.character.name);
                fightButton.classList.add('enemy-button');
                actionButtons.appendChild(fightButton);
                buttons.push(fightButton);
            }
        }
        
        if (room.items && room.items.length > 0) {
            room.items.forEach(item => {
                if (!inventory.includes(item)) {
                    const takeButton = createButton("Take " + item.name, (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        takeItem(item, room);
                    }, "Take " + item.name);
                    takeButton.classList.add('item-button');
                    actionButtons.appendChild(takeButton);
                    buttons.push(takeButton);
                }
            });
        }
        
        const inventoryButton = createButton("Check Inventory", (e) => {
            e.preventDefault();
            e.stopPropagation();
            displayInventory();
        }, "Check your inventory");
        inventoryButton.classList.add('inventory-button');
        actionButtons.appendChild(inventoryButton);
        buttons.push(inventoryButton);
        
        buttonContainer.appendChild(actionButtons);
        
        if (buttons.length > 0) {
            buttons[0].focus();
        }
        
        hideLoading();
    }, 500);
}

/**
 * Displays the player's inventory with compact layout
 */
function displayInventory() {
    const textarea = document.getElementById("textarea");
    const userentry = document.getElementById("userentry");
    const buttonArea = document.getElementById("buttonarea");
    
    if (gameStarted) {
        buttonArea.classList.add('hidden');
    }
    
    userentry.innerHTML = "";
    textarea.className = "game-text text-center themed-background";
    
    let content = '<div class="compact-inventory">';
    content += '<h2>Inventory</h2>';
    
    if (inventory.length === 0) {
        content += '<p class="empty-inventory">Empty</p>';
    } else {
        content += '<div class="inventory-list">';
        inventory.forEach(item => {
            content += `<div class="inventory-item">
                <strong>${item.name}</strong>
                <span class="item-description">${item.description}</span>
            </div>`;
        });
        content += '</div>';
    }
    content += '</div>';
    
    textarea.innerHTML = content;
    
    const returnButton = createButton("Return to Game", (e) => {
        e.preventDefault();
        e.stopPropagation();
        displayRoomInfo(currentRoom);
    }, "Return to game");
    returnButton.classList.add('return-button');
    userentry.appendChild(returnButton);
    returnButton.focus();
}

/**
 * Handles combat with enemies
 * @param {Enemy} enemy - The enemy to fight
 */
function fightEnemy(enemy) {
    showLoading();
    setTimeout(() => {
        const textarea = document.getElementById("textarea");
        const userentry = document.getElementById("userentry");
        const buttonArea = document.getElementById("buttonarea");
        
        // Keep start button area hidden
        if (gameStarted) {
            buttonArea.classList.add('hidden');
        }
        
        // Clear all existing buttons
        userentry.innerHTML = "";
        
        textarea.className = "game-text text-center";
        textarea.innerHTML = "You are fighting " + enemy.name + "!";
        
        const hasItem = inventory.some(item => enemy.fight(item));
        
        if (hasItem) {
            textarea.innerHTML += "<br><br>You defeated the " + enemy.name + " using the " + enemy.weakness.replace(/_/g, ' ') + "!";
            currentRoom.character = null;
            defeatedEnemies.push(enemy.name);
            
            if (defeatedEnemies.includes("Skeleton Warrior") && defeatedEnemies.includes("Dragon")) {
                textarea.innerHTML += "<br><br>Congratulations! You have defeated all the enemies and won the game!";
                const restartButton = createButton("Restart Game", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    resetToStartScreen();
                }, "Restart Game");
                userentry.appendChild(restartButton);
                restartButton.focus();
            } else {
                const continueButton = createButton("Continue", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    displayRoomInfo(currentRoom);
                }, "Continue");
                userentry.appendChild(continueButton);
                continueButton.focus();
            }
        } else {
            // Game over state
            gameStarted = false;
            
            // Clear and hide game controls
            const gameForm = document.getElementById("gameform");
            const gameControls = gameForm.querySelector("#userentry");
            gameControls.innerHTML = "";
            gameControls.classList.add('hidden');
            
            // Show game over message
            textarea.innerHTML = "You were defeated by the " + enemy.name + "! Game Over.";
            
            // Create a new button container for the restart button
            buttonArea.innerHTML = "";
            buttonArea.classList.remove('hidden');
            buttonArea.classList.add('visible');
            const restartButton = createButton("Restart Game", (e) => {
                e.preventDefault();
                e.stopPropagation();
                resetToStartScreen();
            }, "Restart Game");
            buttonArea.appendChild(restartButton);
            restartButton.focus();
        }
        
        hideLoading();
    }, 500);
}

/**
 * Unlocks access to the throne room after obtaining the Royal Seal
 */
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

/**
 * Handles character dialogue interactions
 * @param {Character} character - The character to talk to
 */
function talkToCharacter(character) {
    showLoading();
    setTimeout(() => {
        const textarea = document.getElementById("textarea");
        const userentry = document.getElementById("userentry");
        const buttonArea = document.getElementById("buttonarea");
        
        // Keep start button area hidden during gameplay
        if (gameStarted) {
            buttonArea.classList.add('hidden');
        }
        
        // Clear all existing buttons
        userentry.innerHTML = "";
        
        textarea.className = "game-text text-center";
        
        if (character.name === "Guard") {
            const hasSeal = inventory.some(item => item.name === "Royal Seal");
            if (hasSeal) {
                textarea.innerHTML = "The Guard says: 'Ah, you have the Royal Seal! You are indeed worthy to enter the throne room. The armory can be accessed through a hidden door in the throne room.'";
                unlockThroneRoom();
                
                const proceedButton = createButton("Proceed to Throne Room", (e) => {
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
                }, "Proceed to Throne Room");
                userentry.appendChild(proceedButton);
                proceedButton.focus();
            } else {
                textarea.innerHTML = character.converse() + "<br>The Guard says: 'You need the Royal Seal to enter the throne room.'";
                const returnButton = createButton("Return to Game", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    displayRoomInfo(currentRoom);
                }, "Return to game");
                userentry.appendChild(returnButton);
                returnButton.focus();
            }
        } else if (character.name === "Wizard") {
            const hasSeal = inventory.some(item => item.name === "Royal Seal");
            if (hasSeal) {
                textarea.innerHTML = "The Wizard says: 'Ah, I see you've found the Royal Seal! That is a powerful artifact indeed. Take it to the Guard in the Great Hall - he will grant you access to the throne room. The armory can be accessed through a secret door in the throne room.'";
            } else {
                textarea.innerHTML = character.converse();
            }
            const returnButton = createButton("Return to Game", (e) => {
                e.preventDefault();
                e.stopPropagation();
                displayRoomInfo(currentRoom);
            }, "Return to game");
            userentry.appendChild(returnButton);
            returnButton.focus();
        } else {
            textarea.innerHTML = character.converse() + "<br>" + character.describe();
            const returnButton = createButton("Return to Game", (e) => {
                e.preventDefault();
                e.stopPropagation();
                displayRoomInfo(currentRoom);
            }, "Return to game");
            userentry.appendChild(returnButton);
            returnButton.focus();
        }
        
        hideLoading();
    }, 500);
}

/**
 * Handles picking up items from rooms
 * @param {Item} item - The item to pick up
 * @param {Room} room - The room the item is in
 */
function takeItem(item, room) {
    if (!inventory.includes(item)) {
        // Add item to inventory and remove from room
        inventory.push(item);
        const index = room.items.indexOf(item);
        if (index > -1) {
            room.items.splice(index, 1);
        }
        
        // Show feedback message
        const textarea = document.getElementById("textarea");
        textarea.className = "game-text text-center";
        textarea.innerHTML = "You picked up the " + item.name + ".";
        
        // Clear existing buttons
        const userentry = document.getElementById("userentry");
        userentry.innerHTML = "";
        
        // Add continue button
        const continueButton = createButton("Continue", (e) => {
            e.preventDefault();
            e.stopPropagation();
            displayRoomInfo(currentRoom);
        }, "Continue exploring");
        userentry.appendChild(continueButton);
        continueButton.focus();
    }
}

/**
 * Resets the game to the start screen
 */
function resetToStartScreen() {
    showLoading();
    
    // Reset game state
    currentRoom = null;
    inventory = [];
    defeatedEnemies = [];
    gameStarted = false;
    
    // Hide game form and ensure userentry is ready for next game
    const gameForm = document.getElementById("gameform");
    gameForm.classList.add('hidden');
    
    const userentry = document.getElementById("userentry");
    userentry.classList.remove('hidden');
    userentry.classList.add('visible');
    userentry.innerHTML = "";
    
    // Update text area
    const textArea = document.getElementById("textarea");
    textArea.className = "game-text text-center";
    textArea.innerHTML = "Welcome to Castle Adventure!<br>" +
        "You find yourself at the entrance of an ancient castle.<br>" +
        "Clear the dungeon of all enemies to win, but first you must find a way in!";
    
    // Create button area if it doesn't exist
    let buttonArea = document.getElementById("buttonarea");
    if (!buttonArea) {
        buttonArea = document.createElement("nav");
        buttonArea.id = "buttonarea";
        buttonArea.className = "button-container";
        buttonArea.setAttribute("role", "navigation");
        buttonArea.setAttribute("aria-label", "Game navigation");
        document.getElementById("details").appendChild(buttonArea);
    }
    
    // Clear existing buttons and add start button
    buttonArea.innerHTML = "";
    buttonArea.classList.remove('hidden');
    buttonArea.classList.add('visible');
    const startButton = createButton("Begin Adventure", startGame, "Start Game");
    buttonArea.appendChild(startButton);
    
    // Hide loading and show button area
    setTimeout(() => {
        hideLoading();
        startButton.focus();
    }, 1000);
}

// ============= Event Listeners =============

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    initializeGameUI();
});

/**
 * Sets up all event listeners
 */
function setupEventListeners() {
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
    
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && 
            document.getElementById('help-content').classList.contains('visible')) {
            e.preventDefault();
            e.stopPropagation();
            hideHelp();
        }
    });
    
    document.addEventListener('keydown', handleGlobalKeyNavigation);
}

/**
 * Initializes the game UI
 */
function initializeGameUI() {
    document.getElementById("gameform").classList.add('hidden');
    
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
    const buttonArea = document.getElementById("buttonarea");
    buttonArea.innerHTML = '';
    const startButton = createButton("Begin Adventure", startGame, "Start Game");
    buttonArea.appendChild(startButton);
    startButton.focus();
}
