/*
 * Bundle: Routes - User
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const user = require('../handlers/user');
const middleware = require('../helpers/middleware');

const authMid = middleware.ensureAuthenticated;
const adminMid = [middleware.ensureAuthenticated, middleware.ensureAdmin];

module.exports = (app) => {
	app.param('userId', user.load);
	//INFORMATION
	app.get('/user/:userId', user.getUserInfo);
	app.put('/user', authMid, user.updateInfo);
	app.delete('/user', authMid, user.deleteUser);
	//AUTH
	app.get('/auth/:email', user.userExist);
	app.get('/auth/getMail/:id', user.getMail);
	app.post('/auth/signup', user.signup);
	app.post('/auth/login', user.login);
	//ADMIN
	app.get('/admin', adminMid, user.getAdmins);
	//SOCIAL
	app.get('/user/readlists/:userId', user.getUserReadlists);
	app.get('/user/likes/:userId', user.getUserLikes);
	app.get('/user/shares/:userId', user.getUserShares);
	app.get('/user/history/:userId', user.getUserHistory);
	//FRIENDS
	app.get('/user/friends/:userId', user.getUserFriends);
	app.post('/user/friends/:userId', authMid, user.addFriends);
	app.delete('/user/friends/:userId', authMid, user.deleteFriends);
};