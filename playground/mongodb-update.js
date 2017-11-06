// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  let collection = db.collection('Users');
    // collection.findOneAndUpdate({
    //   _id: new ObjectID('59fceda164bdbfed836c8ca7')
    // }, {
    //   $set: {
    //     completed: true
    //   }
    // }, {
    //   returnOriginal: false
    // }).then((res) => {
    //   console.log(res)
    // });
    collection.findOneAndUpdate({
      _id: new ObjectID('59fcef56b052c76b07708949')
    }, {
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false
    }).then((res) => {
      console.log(res);
    });

  // db.close();
});
