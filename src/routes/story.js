/*
 * Bundle: Routes - Story
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const story = require('../handlers/story');
const middleware = require('../helpers/middleware');

const authMid = middleware.ensureAuthenticated;
const adminMid = [middleware.ensureAuthenticated, middleware.ensureAdmin];

module.exports = (app) => {
	app.param('storyId', story.load);
	//INFORMATION
	app.get('/story/:storyId', story.getStoryFromId);
	app.post('/story', authMid, story.addStory);
	app.post('/story/scrap/url', story.getStoryFromUrl);
};