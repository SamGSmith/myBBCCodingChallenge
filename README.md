# myBBC Coding Challenge

A simple Push Notification Service where one can add users, list users and send notifications with Pushbullet. Made using ExpressJs.

## Requirements

-Node and npm

## To Requirements

- Clone this repository
- Navigate to the directory in Node command prompt and run 'npm install'
- Start the server with 'node server.js'

## To use the API

To add a new user, send a POST request to localhost:3000/api/user with the following in the body:
-username: exampleUsername
-accessToken: exampleAccessToken (pushbullet access token)

To see all users in the system, send a GET request to localhost:3000/api/user

To send a notification, send a GET request to localhost:3000/send/:user, where :user is the username of the user you want to send a notification to.
