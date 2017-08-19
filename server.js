var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var expressValidator = require('express-validator');
var routes = require('./routes/api');

// set up bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set up express-validator
app.use(expressValidator());

// use specified routes
app.use('/api', routes);

// simple error handling middleware
app.use(function(err, req, res, next) {
	if (err) {
		res.send({error: err.message});
	}
});

// set the port
var port = process.env.PORT || 3000;
app.listen(port);
