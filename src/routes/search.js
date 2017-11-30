/*
 * Bundle: Routes - Search
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const search = require('../handlers/search');

module.exports = (app) => {
	//REQUEST
	app.post('/search', search.searchSomething);
};