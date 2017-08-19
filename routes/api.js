/**
 * api.js defines the routes for the API. Effectively acts as controller.
 */

var express = require('express');
var request = require('request');
var router = express.Router();
var user = require('../models/user.js');
var usersArr = require('../models/usersArr.js');

//TODO add link to github repo
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to this api, where you can add users and send notifications via pushbullet' });
});

// route for adding new user
router.post('/user', function(req, res, next) {
  // check username and accessToken included
  req.checkBody('username', 'Invalid username').notEmpty();
  req.checkBody('accessToken', 'Invalid access token').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.status(422);
    next(new Error('Validation errors: '+errors[0].msg));
  } else {
    // check username hasn't been used before
    if (usersArr.isUsernameUnique(req.body.username)) {
      //add newUser to usersArr
      var newUser = usersArr.addUser(req.body.username, req.body.accessToken);
      res.send(newUser);
    } else {
      res.status(409);
      next(new Error('Username '+req.body.username+' already exists.'));
    }

  }
});

// list all users
router.get('/user', function(req, res) {
  res.send(usersArr.getUser());
});

// send a notification to specified user
router.get('/send/:username', function(req, res, next){
  var username = req.params.username;

  var user = usersArr.getUser(username);

  // check that user exists
  if (user instanceof Error) {
    res.status(404);
    //user is error, send to error handling middleware
    next(user);
  } else {
    // create appropriate pushbullet api query
    var headers = {
        'Access-Token': user.accessToken,
        'Content-Type': 'application/json'
    };

    // notification title and text
    var dataString = '{"type":"note","title":"Notification!","body":"From BBC coding challenge api"}';

    // options for request function
    var options = {
        url: 'https://api.pushbullet.com/v2/pushes',
        method: 'POST',
        headers: headers,
        body: dataString
    };

    console.log("Sending notification");

    // use request to send request to pushbullet API
    request(options, function(err, response, body) {
      if (!err && response.statusCode == 200) {
          console.log("Notification sent.");

          // increment notification count for this user
          user.numOfNotificationsPushed++;

          res.send("Notification sent to "+username);
      } else {
        res.status(404);
        next(new Error('Failed to send push notification. Check accessToken is valid for user: '+username));
      }
    });
  }
});

module.exports = router;
