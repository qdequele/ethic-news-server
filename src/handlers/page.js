/*
 * Bundle: Handlers - Page
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const mongoose = require('mongoose');

const Page = mongoose.model('Page');
const Readlist = mongoose.model('Readlist');

const scraper = require('../helpers/scraper.js')
const pageHelpers = require('../helpers/page.js');

/**
 * [load description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @param  {[type]}   id   [description]
 * @return {[type]}        [description]
 */
exports.load = (req, res, next, id) => {
	const select = '_id hostname name avatar description hostname creationDate blacklisted paying likes shares';
	Page.findOneById(id, select)
		.then((page) => {
			req.page = page;
			next();
		})
		.catch((err) => {
			req.query.pageId = id;
			next();
		});
};
/*
 * INFORMATION
 */
/**
 * [pageInfo description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.pageInfo = (req, res, next) => {
	const showSuccess = (data) => {
		res.send(200, req.page);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Page.viewOneById(req.page._id)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [createPage description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.createPage = (req, res, next) => {
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	pageHelpers.getPageChain(req.body.link)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [modifyPage description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.modifyPage = (req, res, next) => {

	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Page.updateOne(req.page._id, req.body)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [deletePage description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.deletePage = (req, res, next) => {
	const showSuccess = (data) => {
		res.send(200, {
				'message': 'Page deleted'
			});
	};
	const showError = (err) => {
		res.send(400, err);
	};

	Page.findByIdAndRemove(req.page._id)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getReadlistOfPage description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getReadlistOfPage = (req, res, next) => {
	let params = {
		'likes': -1
	};
	const array = [req.page._id];

	const showSuccess = (data) => {
		return new Promise((resolve, reject) => {
			res.send(200, data);
			resolve();
		});
	};
	const showError = (err) => {
		return new Promise((resolve, reject) => {
			res.send(400, err);
			resolve();
		});
	};

	Readlist.findSpecificByPageId(params, array, req.query.limit, req.query.offset)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getPageFromUrl description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getPageFromUrl = (req, res, next) => {
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	scraper.scrapMedia(req.body.link)
		.then(showSuccess)
		.catch(showError);
};

/*
 * SOCIAL
 */
/**
 * [getLikesOfPage description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getLikesOfPage = (req, res, next) => {
	const select = '_id hostname likesList';

	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};

	Page.findOneById(req.page._id, select)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [likesPage description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.likesPage = (req, res, next) => {
	const likePage = (page) => {
		return new Promise ((resolve, reject) => {
			page.likesList.push(req.userId);
			page.likes = page.likes + 1;
			page.save((err) => {
				if (err) reject({
					'message': 'Not liked'
				});
				resolve({
					'message': 'Liked'
				});
			});
		});
	};
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Page.findById(req.page._id)
		.then(likePage)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [unlikesPage description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.unlikesPage = (req, res, next) => {
	const unlikePage = (page) => {
		return new Promise ((resolve, reject) => {
			let index = page.likesList.indexOf(req.userId);
			page.likesList.splice(index, 1);
			page.likes = page.likes - 1;
			page.save((err) => {
				if (err) reject({
					'message': 'Not unliked'
				});
				resolve({
					'message': 'Unliked'
				});
			});
		});
	};
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Page.findById(req.page._id)
		.then(unlikePage)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [sharePage description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.sharePage = (req, res, next) => {
	const sharePage = (page) => {
		return new Promise ((resolve, reject) => {
			page.sharesList.push(req.userId);
			page.shares = page.shares + 1;
			page.save((err) => {
				if (err) reject({
					'message': 'Not liked'
				});
				resolve({
					'message': 'Liked'
				});
			});
		});
	};
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Page.findById(req.page._id)
		.then(sharePage)
		.then(showSuccess)
		.catch(showError);
};