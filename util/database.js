const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callBack) =>
  MongoClient.connect(
    "mongodb+srv://abhi:KbAWt5vIWX1ZgDrP@cluster0.wnmuojk.mongodb.net/?appName=Cluster0"
  )
    .then((client) => {
      console.log("connected!");
      _db = client.db();
      callBack();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

const getDb = () => {
  if (_db) return _db;
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
