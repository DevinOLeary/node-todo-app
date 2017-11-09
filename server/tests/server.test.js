const request = require('supertest');
const expect = require('expect')
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos); //before each test case, the Todo collection will be cleared out

describe('Post /todos', () => { //describer block
  it('should create a new todo', (done) => { //text to define test case. done is passed to end the async request
    let text = 'Test todo text'; //variable that will be sent to server

    request(app) // starts supertest using the app import from the express server
    .post('/todos') //indicate posting action to the app's /todos route
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1)
    }).end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get todo matching id', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should not get todo matching id from different user', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object IDs', (done) => {
    let wrongId = 123;
    request(app)
    .get(`/todos/${wrongId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
});



describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let hexId = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
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

  it('should not remove a todo if different user', (done) => {
    let hexId = todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end((err, res) => {
      if(err){
        return done(err);
      }
      Todo.findById(hexId).then((todo) => {
        expect(todo).toExist();
        done();
      }).catch((err) => done(err));
    });
  });

  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if invalid id', (done) => {
    request(app)
    .delete(`/todos/123`)
    .set('x-auth', users[1].tokens[0].token)
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
    .set('x-auth', users[1].tokens[0].token)
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

  it('should not update the todo if different user', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text = 'completed this todo';

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({
      text,
      completed: true
    })
    .expect(404)
    .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text = 'completed this todo';

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
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

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    }).end(done);
  });

  it('should return 401 for unauthenticated login', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
        expect(res.body).toEqual({})
    }).end(done);
  });

});

describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = 'dj@gmail.com';
    let password = '12345asdf';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    }).end((err) => {
      if(err){
        return done(err);
      }

      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      }).catch((err) => done(err));
    });
  });

  it('should return validation errors if request is invalid', (done) => {
    let email = 'dj.com';
    let password = '12';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

  it('should not create user if email is already in use', (done) => {
    let email = users[0].email;
    let password = '1212345asdf';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth']).toExist();
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[1]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((err) => done(err));
    });
  });

  it('should reject invalid login', (done) => {
    let email = 'deole@some.com';
    let password = '123qwe';

    request(app)
    .post('/users/login')
    .send({
      email,
      password
    })
    .expect(400)
    .expect((res) => {
      expect(res.header['x-auth']).toNotExist();
    }).end((err, res) => {
      if(err){
        return done(err);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((err) => done(err));
    });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if(err){
        return done(err);
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((err) => done(err));
    });
  });
});
