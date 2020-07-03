import {Room} from './modules/room.js'
import {Item} from './modules/item.js'
import {Enemy} from './modules/character.js'

export function gameSetup() {
//create the indiviual room objects and add their descriptions
const Kitchen = new Room("kitchen");
Kitchen.description = "a long narrow room with worktops on either side and a large bench in the middle";
const Lounge = new Room("lounge");
Lounge.description = "a large room with two sofas and a large fire place";
const GamesRoom = new Room("Games Room");
GamesRoom.description = "a large room with a pool table at it's centre";
const Hall = new Room("hall");
Hall.description = "a grand entrance hall with large paintings around the walls";

//link the rooms together
Kitchen.linkRoom("south", Lounge);
Kitchen.linkRoom("east", Hall);
Lounge.linkRoom("north", Kitchen);
Lounge.linkRoom("east", GamesRoom);
GamesRoom.linkRoom("west", Lounge);
GamesRoom.linkRoom("north", Hall);
Hall.linkRoom("south", GamesRoom);
Hall.linkRoom("west", Kitchen);

//add characters
const Dave = new Enemy("Dave");
Dave.conversation = "grrr brains";
Dave.description = "a smelly Zombie";
Dave.pronoun = "he";
Dave.weakness = "cheese";


// add characters to rooms
Kitchen.character = Dave;
}