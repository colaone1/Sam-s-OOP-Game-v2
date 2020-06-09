class Room {
  constructor(name) {
    this._name = name;
    this._description = "";
    this._linkedRooms = {};
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description
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
  linkRoom(direction, roomToLink){
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
  move(direction) {
    if (direction in this._linkedRooms) {
      return this._linkedRooms[direction];
    } else {
      alert ("You can't go that way",);
      return this;
    }
  }
}

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

/**
 * Subroutine to display information about the current room
 * 
 * @param {object} room the room to be displayed
 * @author Neil Bizzell
 * @version 1.0 
 */
function displayRoomInfo(room) {
  textContent = "<p>" + room.describe() + "</p>" + "<p>" + room.getDetails() + "</p>" ;

  document.getElementById("textarea").innerHTML = textContent;
  document.getElementById("buttonarea").innerHTML = '><input type="text" id="usertext" />';
  document.getElementById("usertext").focus();
}

/**
 * Subroutine to complete inital game set up then handle commands from the user
 * 
 * @author Neil Bizzell
 * @version 1.0
 */
function startGame(){
  currentRoom = Kitchen
  displayRoomInfo(currentRoom);

  document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        command = document.getElementById("usertext").value;
        const directions = ["north", "south", "east", "west"]
        if (directions.includes( command.toLowerCase() ) ) {
          currentRoom = currentRoom.move(command)
          displayRoomInfo(currentRoom); 
        } else {
          document.getElementById("usertext").value = ""
          alert("that is not a valid command please try again")
        }

    }
  });

}
