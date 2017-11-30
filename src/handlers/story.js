/*
 * Bundle: Handlers - Story
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const mongoose 		= require('mongoose');
const url 			= require('url');

const Story 		= mongoose.model('Story');
const Page 			= mongoose.model('Page');

const scraper 		= require('../helpers/scraper.js');
const pageHelpers 	= require('../helpers/page.js');
const storyHelpers 	= require('../helpers/story.js');

/**
 * [load description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @param  {[type]}   id   [description]
 * @return {[type]}        [description]
 */
exports.load = (req, res, next, id) => {
	const select = 'username friends description avatar firstName lastName';
	Story.findOneById(id, select)
		.then((story) => {
			req.story = story;
			next();
		})
		.catch((err) => {
			return res.send(400, err);
		});
};
/*
 * INFORMATION
 */
/**
 * [getStoryFromId description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getStoryFromId = (req, res) => {
	res.send(200, req.story);
};
/**
 * [getStoryFromUrl description]
 * @param  {[type]}   req  Request params
 * @param  {[type]}   res  Sender of response
 * @return {[type]}        [description]
 */
exports.getStoryFromUrl = (req, res) => {
	const showSuccess = (data) => {
		res.send(400, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	scraper.scrapArticle(req.body.link)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [addStory description]
 * @param {[type]}   req  [description]
 * @param {[type]}   res  [description]
 * @param {Function} next [description]
 */
exports.addStory = (req, res, next) => {
	const showSuccess = (data) => {
		res.send(400, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};

	storyHelpers.getStoryChain(req.body.link, pageId)
		.then(showSuccess)
		.catch(showError);
};