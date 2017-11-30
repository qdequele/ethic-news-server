/*
 * Bundle: Server.js
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";
const express 		= require('express');
const fs 			= require('fs');
const mongoose 		= require('mongoose');
const passport 		= require('passport');

const join 			= require('path').join;
const config 		= require('./config/config');
const configDB 		= require('./config/database');

const bodyParser 	= require('body-parser');
const morgan		= require('morgan');

let app = express();
const port = process.env.PORT || 8080;

// Connect to mongodb
var connect = function() {
	var options = {
		server: {
			socketOptions: {
				keepAlive: 1
			}
		}
	};
	mongoose.connect(configDB.mongodb.url, options);
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

require('./config/passport')(passport);

app.set('superSecret', configDB.mongodb.secret);
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-Type,x-requested-with");
  next();
});

// Bootstrap models
fs.readdirSync(join(__dirname, './models')).forEach(function(file) {
	if (~file.indexOf('.js')) require(join(__dirname, './models', file));
});

//Routes
require('./routes/auth')(app);
require('./routes/user')(app);
require('./routes/page')(app);
require('./routes/readlist')(app);
require('./routes/story')(app);
require('./routes/history')(app);
require('./routes/search')(app);
require('./routes/folder')(app);

app.listen(port);
console.log('Listening on port ' + port);
