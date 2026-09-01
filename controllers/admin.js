const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit === "true";
  if (!editMode) return res.redirect("/");

  const id = req.params.productId;

  //this is the same as the code below, but using the user model to get the product instead of the product model directly. This is because we want to make sure that the product belongs to the user who is trying to edit it.
  // Product.findByPk(id)
  //   .then((product) =>
  //     res.render("admin/edit-product", {
  //       pageTitle: "Edit Product",
  //       path: "/admin/edit-product",
  //       editing: editMode,
  //       product: product,
  //     })
  //   )
  //   .catch((err) => res.redirect("/"));

  req.user
    .getProducts({ where: { id } })
    .then((product) => {
      if (product.length === 0) return res.redirect("/");
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product[0],
      });
    })
    .catch((err) => res.redirect("/"));
};

exports.postEditProduct = async (req, res, next) => {
  const id = req.body.productId;

  const product = await Product.findByPk(id);
  product.title = req.body.title;
  product.imageUrl = req.body.imageUrl;
  product.price = req.body.price;
  product.description = req.body.description;
  const updatedProduct = await product.save();
  if (updatedProduct) res.redirect("/admin/products");
  else console.log(updatedProduct);
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  req.user
    .createProduct({ title, imageUrl, price, description })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
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
  const id = req.body.productId;
  req.user
    .getProducts({ where: { id } })
    .then((product) => product.destroy())
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};
