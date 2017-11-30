/*
 * Bundle: handlers - Search
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

/*
 * REQUEST
 */
/**
 * [searchSomething description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.searchSomething = function(res) {
	res.send([{
		name: 'wine1'
	}, {
		name: 'wine2'
	}, {
		name: 'wine3'
	}]);
};