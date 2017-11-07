const request = require('supertest');
const expect = require('expect')

const {app} = require('../server');
const {Todo} = require('../models/todo');

const todos = [{
  text: 'First test todo'
}, {
  text: 'Second test todo'
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
  })
})
