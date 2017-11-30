/*
 * Bundle: Helpers - Middleware
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const jwt = require('jwt-simple');
const mongoose = require('mongoose');

const User = mongoose.model('User');

const config = require('../config/config');
/**
 * [ensureAuthenticated description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.ensureAuthenticated = function(req, res, next) {
	if (req.headers.authorization) {
		var token = req.headers.authorization.split(' ')[1];
		try {
			var decoded = jwt.decode(token, config.jwt.secret, 'HS512');
			if (decoded.exp <= Date.now()) {
				res.send(400, {
					message: 'Access token has expired'
				});
			} else {
				console.log('ensureAuthenticated : ' + decoded.user);
				req.userId = decoded.user;
				return next();
			}
		} catch (err) {
			return res.send(500, {
				message: 'Error parsing token'
			});
		}
	} else {
		return res.send(401, {
			message: 'You must be authentified'
		});
	}
};
/**
 * [ensureReadlistOwner description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.ensureReadlistOwner = function(req, res, next) {
	if (req.userId == req.readlist.userId) {
		return next();
	} else {
		return res.send(401, {
			message: 'You can only modify your Readlist'
		});
	}
};
/**
 * [ensureAdmin description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.ensureAdmin = function(req, res, next) {
	User.findOneById(req.userId, 'admin')
		.then(function(user) {
			console.log('user : %j', user);
			if (user.admin == true)
				next();
			else
				return res.send(401, {
					message: 'Only an administrator can use this function'
				});
		})
		.catch(function(err) {
			return res.send(400, err);
		});

};