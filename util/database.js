const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callBack) =>
  MongoClient.connect(
    "mongodb+srv://abhi:KbAWt5vIWX1ZgDrP@cluster0.wnmuojk.mongodb.net/?appName=Cluster0"
  )
    .then((client) => {
      console.log("connected!");
      callBack(client);
    })
    .catch((err) => console.log(err));

module.exports = mongoConnect;
