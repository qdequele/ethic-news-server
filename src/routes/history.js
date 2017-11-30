/*
 * Bundle: Routes - History
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const history = require('../handlers/history');

module.exports = (app) => {
	//INFORMATION
	app.get('/history/readlist/:user_id', history.getHistoryOfReadlistByUser);
	app.get('/history/readlist/:readlist_id', history.getHistoryOfReadlistByReadlist);
	app.get('/history/page/:user_id', history.getHistoryOfPageByUser);
	app.get('/history/page/:page_id', history.getHistoryOfPageByPage);
	app.get('/history/media/:user_id', history.getHistoryOfMediaByUser);
	app.get('/history/media/:media_id', history.getHistoryOfMediaByMedia);
	app.get('/history/search', history.getHistoryOfSearch);
	app.get('/history/search/:user_id', history.getHistoryOfSearchByUser);
};