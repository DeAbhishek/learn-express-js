const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne()
    .then((user) => {
      if (user) return;
      const newUser = new User({ name: "Abhi", email: "deabhi@gmail.com" });
      newUser.save().then(() => console.log("User created successfully!"));
    })
    .catch((err) => console.log(err));
  User.findById("6adf939bae8b4a2e101a751f")
    .then((user) => {
      req.user = user;
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
