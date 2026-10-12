const mongodb = require("mongodb");
const { getDb } = require("../util/database");

class User {
  constructor(userName, email, cart, id) {
    this.name = userName;
    this.email = email;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.cart = cart || { items: [] };
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id)
      dbOp = db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: this });
    else dbOp = db.collection("users").insertOne(this);
    return dbOp
      .then((result) => console.log("result"))
      .catch((err) => console.log(err));
  }

  addToCart = (product) => {
    const updatedCartItems = [...this.cart.items];

    const cartProductIndex = updatedCartItems.findIndex(
      (cp) => cp.productId.toString() === product._id.toString()
    );

    const newQuantity = 1;
    if (cartProductIndex === -1)
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    else updatedCartItems[cartProductIndex].quantity += newQuantity;

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      )
      .then((product) => product)
      .catch((err) => console.log(err));
  };

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => user)
      .catch((err) => console.log(err));
  }
}

module.exports = User;
