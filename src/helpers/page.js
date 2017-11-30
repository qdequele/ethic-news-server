/*
 * Bundle: Helpers - Page
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const url = require('url');
const mongoose = require('mongoose');

const Page = mongoose.model('Page');

const scraper = require('../helpers/scraper.js')
/**
 * [getPageChain description]
 * @param  {[type]} hostname [description]
 * @return {[type]}          [description]
 */
exports.getPageChain = (hostname) => {

	const scrapMedia = () => {
		return scraper.scrapMedia(hostname);
	};
	const createDataPage = (data) => {
		return new Promise((resolve, reject) => {
			let result = {
				name: data.name || '',
				avatar: data.avatar || '',
				description: data.description || '',
				hostname: hostname
			}
			resolve(result);
		});
	};
	const createOnePage = (data) => {
		return Page.createOne(data);
	};

	return Page.findOneByHostname(hostname)
		.then(scrapMedia)
		.then(createDataPage)
		.then(createOnePage)
};