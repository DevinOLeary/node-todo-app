const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// let id = '5a01fca393a7142024825e5411';
//
// if(!ObjectID.isValid(id)){
//   console.log('ID not valid');
// };
// Todo.find({ //find will query all todos that contain the arguments passed
//   _id: id //mongoose converts string into Object ID
// }).then((todos) => {
//   console.log('Todos', todos);
// });//if this returns nothing, you get an empty array
//
// Todo.findOne({//will only return the first matching object
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });//if this returns nothing, you get null, which can be used in middleware

// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('Id not found');
//   }
//   console.log('Todo by id', todo);
// }).catch((err) => {
//   console.log(err);
// });//use when what you're looking for is the id
let id = '5a00dbf318ca732b3dd08c04'

User.findById(id).then((user) => {
  if(!user){
    return console.log('User not found')
  }
  console.log(JSON.stringify(user, undefined, 2));
}).catch((err) => {
  console.log(err);
});
