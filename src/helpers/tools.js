/*
 * Bundle: Helpers - Token
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const moment = require('moment');

const config = require('../config/config');

/**
 * [formatDate description]
 * @param  {[type]} date     [description]
 * @param  {[type]} friendly [description]
 * @return {[type]}          [description]
 */
exports.formatDate = function(date, friendly) {
	date = moment(date);

	if (friendly) {
		return date.fromNow();
	} else {
		return date.format('DD-MM-YYYY');
	}
};