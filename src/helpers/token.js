/*
 * Bundle: Helpers - Token
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const jwt = require('jwt-simple');
const moment = require('moment');

const config = require('../config/config');
/**
 * [createJwtToken description]
 * @param  {[type]} userId [description]
 * @return {[type]}        [description]
 */
exports.createJwtToken = function(userId) {
	console.log('userId :' + userId);
	let payload = {
		user: userId,
		iat: new Date().getTime(),
		exp: moment().add(7, 'days').valueOf()
	};
	return jwt.encode(payload, config.jwt.secret, 'HS512');
};