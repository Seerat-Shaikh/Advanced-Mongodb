const { MongoClient } = require("mongodb");

let dbConnection;
//Mongodb Atlas Online
let uri = 'mongodb+srv://Seerat:test123@cluster0.vk5gxdo.mongodb.net/firstDatabase?retryWrites=true&w=majority'

module.exports = {
  connectToDb: (cb) => {
    //MongoClient.connect("mongodb://localhost:27017/bookstore") //mongodb compass
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};

