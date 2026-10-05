const path = require("path");
const express = require("express");
const rootDir = require("./util/path");

const mongoConnect = require("./util/database");
const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {});

app.use(errorController.get404);

mongoConnect((client) => {
  console.log(client);
  app.listen(5000, () => console.log("Server is listening on port 5000..."));
});
