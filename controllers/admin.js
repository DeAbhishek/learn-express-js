const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(
    title,
    imageUrl,
    description,
    price,
    null,
    req.user._id
  );

  product
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit === "true";
  if (!editMode) return res.redirect("/");

  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) return res.redirect("/");
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => res.redirect("/"));
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const updatedProduct = new Product(
    title,
    imageUrl,
    description,
    price,
    prodId,
    req.user._id
  );

  updatedProduct
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(req.user._id)
    .then((products) =>
      res.render("admin/products", {
        prods: products,
        path: "/admin/products",
        pageTitle: "Admin Products",
      })
    )
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};
