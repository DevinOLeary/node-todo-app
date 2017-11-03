// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  let collection = db.collection('Todos');

    // db.collection('Todos').find({
    //   _id: new ObjectID('59fcdb3e573b9f6753690f12')
    // }).toArray().then((docs)=>{
    //   console.log('Todos');
    //   console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //   console.log('Unable to fetch Todos', err);
    // });
    // collection.find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //   console.log(err);
    // });
    db.collection('Users').find({
      name:'Smokey'
    }).toArray().then((docs) => {
      console.log(JSON.stringify(docs, undefined, 1));
    });
  db.close();
});
