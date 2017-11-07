const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// Todo.remove({}).then((res) => {
//   console.log(res);
// });

// Todo.findOneAndRemove() Returns doc
// Todo.findByIdAndRemove() Same^

Todo.findByIdAndRemove('5a021aaaca6cef215a214110').then((todo) => {
  console.log(todo);
});
