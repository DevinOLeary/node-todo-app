// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Users').insertOne({
    name: 'Emily',
    age: 4,
    location: 'Chicago'
  }, (err, result) => {
    if(err){
      return console.log('Unable to insert user', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

//   db.collection('Users').insertOne({
//     name: 'Devin',
//     age: 26,
//     location: 'Bloomington'
//   }, (err, result) => {
//     if(err){
//       return console.log('Unable to insert user', err)
//     }
//     console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
//   });
//
  db.close();
});
