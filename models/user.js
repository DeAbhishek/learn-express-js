const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);

// const mongodb = require("mongodb");
// const { getDb } = require("../util/database");

// class User {
//   constructor(userName, email, cart, id) {
//     this.name = userName;
//     this.email = email;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.cart = cart || { items: [] };
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id)
//       dbOp = db
//         .collection("users")
//         .updateOne({ _id: this._id }, { $set: this });
//     else dbOp = db.collection("users").insertOne(this);
//     return dbOp
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }

//   addToCart = (product) => {
//     const updatedCartItems = [...this.cart.items];

//     const cartProductIndex = updatedCartItems.findIndex(
//       (cp) => cp.productId.toString() === product._id.toString()
//     );

//     const newQuantity = 1;
//     if (cartProductIndex === -1)
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     else updatedCartItems[cartProductIndex].quantity += newQuantity;

//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: this._id },
//         { $set: { cart: { items: updatedCartItems } } }
//       )
//       .then((product) => product)
//       .catch((err) => console.log(err));
//   };

//   getCart = () => {
//     const productIds = this.cart.items.map((i) => i.productId);
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } }) // find all products whose _id is in the productIds array
//       .toArray()
//       .then((products) =>
//         products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(
//               (i) => i.productId.toString() === p._id.toString()
//             ).quantity,
//           };
//         })
//       );
//   };

//   deleteItemFromCart = (prodId) => {
//     const updatedCartItems = this.cart.items.filter(
//       (item) => item.productId.toString() !== prodId.toString()
//     );
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: this._id },
//         { $set: { cart: { items: updatedCartItems } } }
//       )
//       .then((products) => products)
//       .catch((err) => console.log(err));
//   };

//   addOrder = () => {
//     const db = getDb();
//     return this.getCart()
//       .then((products) =>
//         db.collection("orders").insertOne({
//           products,
//           user: {
//             _id: this._id,
//             name: this.name,
//           },
//         })
//       )
//       .then(() => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
//       });
//   };

//   getOrders = () => {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ 'user._id': this._id })
//       .toArray()
//       .catch((err) => console.log(err));
//   };

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userId) })
//       .then((user) => user)
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
