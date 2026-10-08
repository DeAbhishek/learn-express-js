const path = require("path");
const express = require("express");
const rootDir = require("./util/path");

const mongoConnect = require("./util/database").mongoConnect;
const errorController = require("./controllers/error");
const User = require("./models/user");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
  User.findById("6ac77e8bff77779fdd340180")
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        const user = new User("Abhi", "deabhishek@gmail.com", null);
        user.save().then((user) => {
          req.user = user;
          next();
        });
      }
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() =>
  app.listen(5000, () => console.log("Server is listening on port 5000..."))
);
