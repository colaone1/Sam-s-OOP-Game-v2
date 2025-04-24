class Enemy extends Character {
  constructor(name, description, conversation, weakness) {
    super(name, description, conversation);
    console.log("Creating enemy with name:", name, "and weakness:", weakness);
    this._weakness = weakness;
  }

  set weakness(value) {
    console.log("Setting weakness to:", value);
    this._weakness = value;
  }

  get weakness() {
    console.log("Getting weakness:", this._weakness);
    return this._weakness;
  }

  /**
   * a method to determine if the item is the enemy's weakness
   * 
   * @param {Item} item - the item to test
   * @returns {boolean} true if the item is the enemy's weakness
   * @author Neil Bizzell
   * @version 1.0
   */
  fight(item) {
    console.log("Fighting with item:", item.name);
    console.log("Item name converted:", item.name.toLowerCase().replace(/\s+/g, '_'));
    console.log("Enemy weakness:", this._weakness);
    if (item.name.toLowerCase().replace(/\s+/g, '_') === this._weakness) {
      return true;
    } else {
      return false;
    }
  }
} 