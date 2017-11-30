/*
 * Bundle: Helpers - Story
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const url = require('url');
const mongoose = require('mongoose');

const Story = mongoose.model('Story');

const scraper = require('../helpers/scraper.js')
const pageHelpers = require('../helpers/page.js');
/**
 * [getStoryChain description]
 * @param  {[type]} link [description]
 * @return {[type]}      [description]
 */
exports.getStoryChain = (link) => {
	const select = 'username friends description avatar firstName lastName';
	const hostname = url.parse(link).protocol + '//' + url.parse(link).hostname;
	let pageId = '';

	const getPageChain = () => {
		return new Promise((resolve, reject) => {
			pageHelpers.getPageChain(hostname)
				.then((data) => {
					pageId = data._id;
					resolve();
				})
				.catch((err) => {
					reject(err);
				});
		});
	};
	const findStory = () => {
		return Story.findOneByUrl(link, select);
	};
	const scrapArticle = () => {
		return scraper.scrapArticle(link);
	};
	const createDataStory = (data) => {
		return new Promise((resolve, reject) => {
			let result = {
				title: data.title || '',
				image: data.image || '',
				pageId: pageId || '',
				url: link
			}
			resolve(result);
		});
	};
	const saveStory = (data) => {
		return Story.createOne(data);
	};

	return getPageChain()
		.then(findStory)
		.then(scrapArticle)
		.then(createDataStory)
		.then(saveStory)
};