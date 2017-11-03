// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  let collection = db.collection('Users');
    // collection.deleteMany({
    //   text: 'clean up'
    // }).then((result) => {
    //   console.log(result)
    // });
    // collection.deleteOne({text: 'clean up'}).then((res) => console.log(res.result));
    // collection.findOneAndDelete({completed: false}).then((res) => {
    //   console.log(res);
    // });
    // collection.deleteMany({name: 'Devin'}).then((res) => {
    //   console.log(res.result);
    // });
    // collection.findOneAndDelete({_id: new ObjectID('59fcddb0451fc5679ffb4d26')}).then((res) => {
    //   console.log(JSON.stringify(res, undefined, 2));
    // }, (err) => {
    //   console.log('it was in there!',err);
    // });

  // db.close();
});
