/*
 * Bundle: Handlers - Readlist
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */
"use strict";

const mongoose = require('mongoose');

const Readlist = mongoose.model('Readlist');
const User = mongoose.model('User');

const select = '_id userId name description image storiesId keywords needPremium readTime view likes likesList shares sharesList';
/**
 * [load description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @param  {[type]}   id   [description]
 * @return {[type]}        [description]
 */
exports.load = (req, res, next, id) => {
	Readlist.findOneById(id, select)
		.then((readlist) => {
			req.readlist = readlist;
			next();
		})
		.catch((err) => {
			req.query.readlist = id;
			next();
		});
};

/*
 * INFORMATION
 */
/**
 * [getReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getReadlist = (req, res) => {
	const showSuccess = (data) => {
		res.send(200, req.readlist);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Readlist.viewOneById(req.readlist._id)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [createReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.createReadlist = (req, res) => {
	const createDataReadlist = (data) => {
		return new Promise((resolve, reject) => {
			let result = {
				userId: req.userId,
				name: data.name || '',
				description: data.description || '',
				image: data.image || '',
				storiesId: data.storiesId || [],
				keywords: data.keywords || []
			}
			resolve(result);
		});
	};
	const createOneReadlist = (result) => {
		return Readlist.createOne(result);
	};
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};

	createDataReadlist(req.body)
		.then(createOneReadlist)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [modifyReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.modifyReadlist = (req, res) => {
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Readlist.updateOne(req.readlist._id, req.body)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [deleteReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.deleteReadlist = (req, res) => {
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Readlist.removeById(req.readlist._id)
		.then(showSuccess)
		.catch(showError);
};

/*
 * SOCIAL
 */
/**
 * [getLikesOfOneReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getLikesOfOneReadlist = (req, res) => {
	const select = 'likesList';

	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Readlist.findOneById(req.readlist._id, select)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [likeReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.likeReadlist = (req, res) => {
	const likeReadlist = (readlist) => {
		return new Promise((resolve, reject) => {
			readlist.likesList.push(req.userId);
			readlist.likes++;
			readlist.save((err) => {
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
	Readlist.findById(req.readlist._id)
		.then(likeReadlist)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [unlikeReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.unlikeReadlist = (req, res) => {
	const unlikeReadlist = (readlist) => {
		return new Promise((resolve, reject) => {
			let index = readlist.likesList.indexOf(req.userId);
			readlist.likesList.splice(index, 1);
			readlist.likes--;
			readlist.save((err) => {
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
	Readlist.findById(req.readlist._id)
		.then(unlikeReadlist)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getSharesOfOneReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getSharesOfOneReadlist = (req, res) => {
	const select = 'sharesList';

	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Readlist.findOneById(req.readlist._id, select)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [shareReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.shareReadlist = (req, res) => {
	const shareReadlist = (readlist) => {
		return new Promise((resolve, reject) => {
			readlist.sharesList.push(req.userId);
			readlist.shares++;
			readlist.save((err) => {
				if (err) reject({
					'message': 'Not shared'
				});
				resolve({
					'message': 'Shared'
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
	Readlist.findById(req.readlist._id)
		.then(shareReadlist)
		.then(showSuccess)
		.catch(showError);
};

/*
 * SORT
 */
/**
 * [getTopReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getTopReadlist = (req, res) => {
	const params = {
		'likes': -1
	};

	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Readlist.findAll(params, req.query.limit, req.query.offset)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getTopReadlistByFriends description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getTopReadlistByFriends = (req, res) => {
	const params = {
		'likes': -1
	};

	const getTopReadlistByFriends = (data) => {
		return Readlist.findSpecificByUserId(params, data.friendsListId, req.query.limit, req.query.offset);
	};
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	User.findOneById(req.userId, 'friendsListId')
		.then(getTopReadlistByFriends)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getTopReadlistByReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getTopReadlistByReadlist = (req, res) => {
	const params = {
		'likes': -1
	};

	const createData = (data) => {
		return new Promise((resolve, reject) => {
			let result = [];
			for (let i = 0; i < data.length; i++) {
				result.push(data[i]._id);
			}
			resolve(result);
		});
	};
	const getTopReadlistByReadlist = (array) => {
		return Readlist.findSpecificByUserId(params, array, req.query.limit, req.query.offset);
	};
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	User.findAllAdmins()
		.then(createData)
		.then(getTopReadlistByReadlist)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getDateReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getDateReadlist = (req, res) => {
	const params = {
		'updateDate': -1
	};

	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Readlist.findAll(params, req.query.limit, req.query.offset)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getDateReadlistByFriends description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getDateReadlistByFriends = (req, res) => {
	const params = {
		'updateDate': -1
	};

	const getDateReadlistByFriends = (array) => {
		return Readlist.findSpecificByUserId(params, data.friendsListId, req.query.limit, req.query.offset);
	};
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	User.findOneById(req.userId, 'friendsListId')
		.then(getDateReadlistByFriends)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getDateReadlistByReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getDateReadlistByReadlist = (req, res) => {
	const params = {
		'updateDate': -1
	};
	const createData = (data) => {
		return new Promise((resolve, reject) => {
			let result = [];
			for (let i = 0; i < data.length; i++) {
				result.push(data[i]._id);
			}
			resolve(result);
		});
	};
	const getDateReadlistByReadlist = (array) => {
		return Readlist.findSpecificByUserId(params, array, req.query.limit, req.query.offset);
	};
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	User.findAllAdmins()
		.then(createData)
		.then(getDateReadlistByReadlist)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getViewReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getViewReadlist = (req, res) => {
	const params = {
		'view': -1
	};

	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Readlist.findAll(params, req.query.limit, req.query.offset)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getViewReadlistByFriends description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getViewReadlistByFriends = (req, res) => {
	const params = {
		'view': -1
	};

	const getViewReadlistByFriends = (array) => {
		return Readlist.findSpecificByUserId(params, data.friendsListId, req.query.limit, req.query.offset);
	};
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	User.findOneById(req.userId, 'friendsListId')
		.then(getViewReadlistByFriends)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getViewReadlistByReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getViewReadlistByReadlist = (req, res) => {
	const params = {
		'view': -1
	};
	const createData = (data) => {
		return new Promise((resolve, reject) => {
			let result = [];
			for (let i = 0; i < data.length; i++) {
				result.push(data[i]._id);
			}
			resolve(result);
		});
	};
	const getViewReadlistByReadlist = (array) => {
		return Readlist.findSpecificByUserId(params, array, req.query.limit, req.query.offset);
	};
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	User.findAllAdmins()
		.then(createData)
		.then(getViewReadlistByReadlist)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getDiscoverReadlist description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getDiscoverReadlist = (req, res) => {
	res.send({
		id: req.params.id,
		name: "The Name",
		description: "description"
	});
};