const request = require('supertest');
const expect = require('expect')
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  completed: false,
  completedAt: null
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}); //befor each test case, the Todo collection will be cleared out

describe('Post /todos', () => { //describer block
  it('should create a new todo', (done) => { //text to define test case. done is passed to end the async request
    let text = 'Test todo text'; //variable that will be sent to server

    request(app) // starts supertest using the app import from the express server
    .post('/todos') //indicate posting action to the app's /todos route
    .send({text}) // used by supertest to create an object to be sent to the server
    .expect(200) //expecting an 'ok' code to return
    .expect((res) => { //custom assertion that expects the response body to be equal to the text variable sent to it
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => { //ends the request creating an object that checks if there's an error or response and passes done to end the test case
      if(err){
        return done(err); //if error, call done with the error
      }

      Todo.find({text}).then((todos) => { //if response, go into Todo collection and pass assertions
        expect(todos.length).toBe(1); //make sure length is greater than 1
        expect(todos[0].text).toBe(text); //make sure content is equal to var sent
        done();//done
      }).catch((err) => done(err));//if error, call done with the error

    });
  });

  it('should not create todo with invalid body data', (done) => {//second test case, collection is cleared before this one starts

    request(app)
    .post('/todos')
    .send({})//nothing is sent to the server
    .expect(400)//model requires length of string to be greater than 0
    .end((err,res) => {
      if(err) {
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((err) => done(err));
    });
  });

});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2)
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get todo matching id', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return 404 if todo is not found', (done) => {
    let hexId = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object IDs', (done) => {
    let wrongId = 123;
    request(app)
    .get(`/todos/${wrongId}`)
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let hexId = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    }).end((err, res) => {
      if(err){
        return done(err);
      }
      Todo.findById(hexId).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((err) => done(err));
    });
  });

  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 if invalid id', (done) => {
    request(app)
    .delete(`/todos/123`)
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {

  it('should update the todo', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text = 'completed this todo';

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      text,
      completed: true
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    }).end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text = 'completed this todo';

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed: false,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    }).end(done);
  });
});
