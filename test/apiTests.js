/**
 * Tests api calls return correct details
 */

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('API calls', function(){

  describe('/GET user', function(){
    it('it should get all users when empty', function(done){
      chai.request(server)
        .get('/api/user')
        .end(function(err, res){
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });

    it('it should get all users when one has been added', function(done){
      chai.request(server)
        .post('/api/user')
        .send({'username': 'carl','accessToken': '10001'})
        .end(function(err, res){
          chai.request(server)
            .get('/api/user')
            .end(function(err, res){
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(1);
              res.body[0].username.should.be.eql('carl');
              done();
            });
        });

    });
  });

  //tests for adding new users
  describe('/POST new user', function(){
    it('Should be able to add a new user when filled correctly', function(done){
      chai.request(server)
        .post('/api/user')
        .send({'username': 'alice','accessToken': 'abc123'})
        .end(function(err, res){
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.username.should.eql('alice');
          res.body.accessToken.should.eql('abc123');
          res.body.numOfNotificationsPushed.should.eql(0);
          done();
        });
    });

    it('Should throw error if user already added', function(done){
      chai.request(server)
        .post('/api/user')
        .send({'username': 'alice','accessToken': 'abc123'})
        .end(function(err, res){
          res.should.have.status(409);
          res.body.should.be.an('object');
          res.body.error.should.eql("Username alice already exists.");
          done();
        });
    });

    it('Should throw error if accessToken already added', function(done){
      chai.request(server)
        .post('/api/user')
        .send({'username': 'bob','accessToken': 'abc123'})
        .end(function(err, res){
          res.should.have.status(409);
          res.body.should.be.an('object');
          res.body.error.should.eql("Access Token abc123 already exists.");
          done();
        });
    });

    it("Should throw error if username is blank", function(done){
      chai.request(server)
        .post('/api/user')
        .send({'username': '','accessToken': 'abc123'})
        .end(function(err, res){
          res.should.have.status(422);
          res.body.should.be.an('object');
          res.body.should.have.property("error", "Validation errors: Invalid username");
          done();
        });
    });

    it("Should throw error if accessToken is blank", function(done){
      chai.request(server)
        .post('/api/user')
        .send({'username': 'bob','accessToken': ''})
        .end(function(err, res){
          res.should.have.status(422);
          res.body.should.be.an('object');
          res.body.should.have.property("error", "Validation errors: Invalid access token");
          done();
        });
    });

    it("Should throw error if username is not included", function(done){
      chai.request(server)
        .post('/api/user')
        .send({'accessToken': 'abc123'})
        .end(function(err, res){
          res.should.have.status(422);
          res.body.should.be.an('object');
          res.body.should.have.property("error", "Validation errors: Invalid username");
          done();
        });
    });

    it("Should throw error if accessToken is not included", function(done){
      chai.request(server)
        .post('/api/user')
        .send({'username': 'bob'})
        .end(function(err, res){
          res.should.have.status(422);
          res.body.should.be.an('object');
          res.body.should.have.property("error", "Validation errors: Invalid access token");
          done();
        });
    });
  });

  //tests for sending notifications
  describe('/GET send notfication', function(){
    //check user exists
    it("Should throw error if specified user doesn't exist", function(done){
      chai.request(server)
        .get('/api/send/notadded')
        .end(function(err, res){
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property("error", "User: notadded not found.");
          done();
        });
    });

    //check notification sent correctly
    //TODO assign accessToken to var in .gitignore and use for this test
    // it('Should return success message if sent to an existing user with valid accessToken'), function(){
    //   chai.request(server)
    //     .post('/api/user')
    //     .send({'username': '','accessToken': ''})
    //     .end(function(err, res){
    //       chai.request(server)
    //         .get('/api/user')
    //         .end(function(err, res){
    //           res.should.have.status(200);
    //           res.body.length.should.be.eql("Notification sent to");
    //TODO check numOfNotificationsPushed is incremented
    //           done();
    //         });
    //     });
    // });

    //check invalid accesstoken error handled correctly
    it('Should return success message if sent to an existing user with valid accessToken', function(){
      chai.request(server)
        .post('/api/user')
        .send({'username': 'test1','accessToken': 'not_a_valid_access_token'})
        .end(function(err, res){
          chai.request(server)
            .get('/api/send/test1')
            .end(function(err, res){
              res.should.have.status(404);
              res.body.should.have.property("error", "Failed to send push notification. Check accessToken is valid for user: test1");
              done();
            });
        });
    });
  });
});
