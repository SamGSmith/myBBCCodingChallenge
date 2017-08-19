/**
 * usersArr.js definition for usersArr objects. Contains methods for
 * adding new users, and getting users.
 */

var user = require('./user.js');

var usersArr = function() {
  this.users = [];
}

// method to add user
usersArr.prototype.addUser = function(username, accessToken) {
  var newUser = new user(username, accessToken);
  this.users.push(newUser);
  return newUser;
}

// get user based on username/all users
usersArr.prototype.getUser = function(username) {
  // Check if username included
  if(typeof username==='undefined') {
    return this.users;
  } else {
    var userNo = this.users.findIndex(function(user) {
  		return user.username === username;
  	});

    if(userNo<0){
      return new Error('User: '+username+' not found.');
    } else {
      return this.users[userNo];
    }
  }
}

// check if user exists by using getUser method
usersArr.prototype.isUsernameUnique = function(username) {
  return (this.getUser(username) instanceof Error);
}

var usersArray = new usersArr();

module.exports = usersArray;
