const Order = require("../models/order");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        path: "/products",
        pageTitle: "All Products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    res.render("shop/product-detail", {
      product,
      path: "/products",
      pageTitle: product.title,
    });
  });
};

exports.getIndex = (req, res, index) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        path: "/",
        pageTitle: "Shop",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) throw new Error("Product not found");
      else req.user.addToCart(product).then(() => res.redirect("/cart"));
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) =>
  req.user
    .removeFromCart(req.body.productId)
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));

exports.postOrder = (req, res, next) =>
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((prod) => {
        const { _id, userId, __v, ...productData } = prod.productId._doc;
        return { product: { ...productData }, quantity: prod.quantity };
      });
      const order = new Order({
        products,
        user: {
          userId: req.user,
          name: req.user.name,
        },
      });
      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) =>
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
      })
    )
    .catch((err) => console.log(err));
};
