const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const path = require("path");
const express = require("express");
const rootDir = require("./util/path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const mongoose = require("mongoose");
// const mongoConnect = require("./util/database").mongoConnect;
const errorController = require("./controllers/error");
const User = require("./models/user");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const MONGODB_URI =
  "mongodb+srv://abhi:KbAWt5vIWX1ZgDrP@cluster0.wnmuojk.mongodb.net/shop?appName=Cluster0";

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));
app.use(
  session({
    secret: "My secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use((req, res, next) => {
  User.findById("6adf939bae8b4a2e101a751f")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(authRoutes);
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// mongoConnect(() =>
//   app.listen(5000, () => console.log("Server is listening on port 5000..."))
// );

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    User.findOne()
      .then((user) => {
        if (user) return;
        const newUser = new User({ name: "Abhi", email: "deabhi@gmail.com" });
        newUser.save().then(() => console.log("User created successfully!"));
      })
      .catch((err) => console.log(err));

    app.listen(5000, () => console.log("Server is listening on port 5000..."));
  })
  .catch((err) => console.log(err));
