/*
 * Bundle: Handlers - Folder
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const mongoose	= require('mongoose');

const Folder 	= mongoose.model('Folder');

const SUCCESS 	= 200;
const FAILED 	= 400;
/**
 * [load description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @param  {[type]}   id   [description]
 * @return {[type]}        [description]
 */
exports.load = (req, res, next, id) => {
	const select = '_id name image readlistsId creationDate';
	Folder.findOneById(id, select)
		.then((folder) => {
			req.folder = folder;
			next();
		})
		.catch((err) => {
			req.query.folderId = id;
			next();
		});
};
/*
 * INFORMATION
 */

/**
 * [getFolder description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getFolder = (req, res, next) => {
	const showSuccess = (data) => {
		res.send(SUCCESS, req.folder);
	};
	const showError = (err) => {
		res.send(FAILED, err);
	};
	Folder.viewOneById(req.folder._id)
		.then(sender.showSuccess)
		.catch(sender.showError);
};
/**
 * [createPage description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.createFolder = (req, res, next) => {
	const showSuccess = (data) => {
		res.send(SUCCESS, req.folder);
	};
	const showError = (err) => {
		res.send(FAILED, err);
	};
	Folder.createOne(req.body)
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
exports.modifyFolder = (req, res, next) =>{
	const showSuccess = (data) => {
		res.send(SUCCESS, req.folder);
	};
	const showError = (err) => {
		res.send(FAILED, err);
	};
	Folder.updateOne(req.folder._id, req.body)
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
exports.deleteFolder = (req, res, next) => {
	const showSuccess = (data) => {
		res.send(SUCCESS, req.folder);
	};
	const showError = (err) => {
		res.send(FAILED, err);
	};
	Folder.findByIdAndRemove(req.folder._id)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getDateReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getDateFolders = (req, res) => {
	let params = {
		'updateDate': -1
	};

	const showSuccess = (data) => {
		res.send(SUCCESS, req.folder);
	};
	const showError = (err) => {
		res.send(FAILED, err);
	};
	Folder.findAll(params, req.query.limit, req.query.offset)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getViewReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getViewFolders = (req, res) => {
	let params = {
		'view': -1
	};

	const showSuccess = (data) => {
		res.send(SUCCESS, req.folder);
	};
	const showError = (err) => {
		res.send(FAILED, err);
	};
	Folder.findAll(params, req.query.limit, req.query.offset)
		.then(showSuccess)
		.catch(showError);
};