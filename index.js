import {gameSetup} from './modules/setup.js'

/**
 * Subroutine to display information about the current room
 * 
 * @param {object} room the room to be displayed
 * @author Neil Bizzell
 * @version 1.0 
 */
function displayRoomInfo(room) {
  let occupantMsg = ""
  if (room.character === "") {
    occupantMsg = ""
  } else {
    occupantMsg = room.character.describe() + ". " + room.character.converse()
  }

  textContent = "<p>" + room.describe() + "</p>" + "<p>" +
    occupantMsg + "</p>" + "<p>" + room.getDetails() + "</p>";

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
function startGame() {
  //set up game and display start room
  gameSetup()
  currentRoom = Kitchen
  displayRoomInfo(currentRoom);

  //

  //handle commands
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      command = document.getElementById("usertext").value;
      const directions = ["north", "south", "east", "west"]
      if (directions.includes(command.toLowerCase())) {
        currentRoom = currentRoom.move(command)
        displayRoomInfo(currentRoom);
      } else {
        document.getElementById("usertext").value = ""
        alert("that is not a valid command please try again")
      }

    }
  });
}
