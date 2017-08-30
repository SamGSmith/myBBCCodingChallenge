var chai = require('chai');
var should = chai.should();
var user = require('../models/user.js');

describe('User', function(){
  it('user constructor has correct attributes when given username and accessToken', function(done){
    var testUser1 = new user("aaa", "a1");

    testUser1.should.have.property("username", "aaa");
    testUser1.should.have.property("accessToken", "a1");
    testUser1.should.have.property("creationTime");
    testUser1.should.have.property("numOfNotificationsPushed", 0);
    done();
  });



});
