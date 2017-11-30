/*
 * Bundle: Routes - Readlist
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const readlist = require('../handlers/readlist');
const middleware = require('../helpers/middleware');

const authMid = middleware.ensureAuthenticated;
const readlistMid = [middleware.ensureAuthenticated, middleware.ensureReadlistOwner];

module.exports = (app) => {
	app.param('readlist_id', readlist.load);
	//INFORMATION
	app.post('/readlist', authMid, readlist.createReadlist);
	app.put('/readlist/:readlist_id', readlistMid, readlist.modifyReadlist);
	app.delete('/readlist/:readlist_id', readlistMid, readlist.deleteReadlist);
	app.get('/readlist/:readlist_id', readlist.getReadlist);
	//SOCIAL
	app.get('/readlist/like/:readlist_id', readlist.getLikesOfOneReadlist);
	app.post('/readlist/like/:readlist_id', authMid, readlist.likeReadlist);
	app.delete('/readlist/like/:readlist_id', authMid, readlist.unlikeReadlist);
	app.get('/readlist/share/:readlist_id', readlist.getSharesOfOneReadlist);
	app.post('/readlist/share/:readlist_id', authMid, readlist.shareReadlist);
	//GETTERS
	app.get('/readlist/top/:max/:offset', readlist.getTopReadlist);
	app.get('/readlist/top/friends/:max/:offset', authMid, readlist.getTopReadlistByFriends);
	app.get('/readlist/top/readlist/:max/:offset', readlist.getTopReadlistByReadlist);
	app.get('/readlist/view/:max/:offset', readlist.getViewReadlist);
	app.get('/readlist/view/friends/:max/:offset', authMid, readlist.getViewReadlistByFriends);
	app.get('/readlist/view/readlist/:max/:offset', readlist.getViewReadlistByReadlist);
	app.get('/readlist/date/:max/:offset', readlist.getDateReadlist);
	app.get('/readlist/date/friends/:max/:offset', authMid, readlist.getDateReadlistByFriends);
	app.get('/readlist/date/readlist/:max/:offset', readlist.getDateReadlistByReadlist);
	app.get('/readlist/discover/:max/:offset', readlist.getDiscoverReadlist);
};