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