/**
 * user.js definition for user objects
 */

function user(username, accessToken) {
  this.username = username;
  this.accessToken = accessToken;

  // get current time and strip milliseconds and timezone
  var timeNow = new Date();
  this.creationTime = timeNow.toISOString().substring(0,19);

  this.numOfNotificationsPushed = 0;

}

module.exports = user;
