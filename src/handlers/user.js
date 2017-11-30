/*
 * Bundle: Handlers - User
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";
const mongoose 		= require('mongoose');
const bcrypt 		= require('bcrypt');

const User 			= mongoose.model('User');
const Validation	= mongoose.model('Validation');

const config 		= require('../config/config');
const token 		= require('../helpers/token');
const mailer 		= require('../helpers/mailer');

/*
 * Middleware - userId search
 */
/**
 * [load description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @param  {[type]}   id   [description]
 * @return {[type]}        [description]
 */
exports.load = (req, res, next, id) => {
	const select = 'email username avatar description friends';
	User.findOneById(id, select)
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => {
			return res.send(400, err);
		});
};

/*
 * GET USERS INFORMATION
 */

/**
 * [getUserInfo description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getUserInfo = (req, res) => {
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	User.viewOneById(req.user._id)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [updateInfo description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.updateInfo = (req, res, next) => {
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	User.updateOne(req.userId, req.body)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [deleteUser description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.deleteUser = (req, res, next) => {
	const comparePassword = (user) => {
		return user.comparePassword(req.body.password);
	};
	const findAndRemove = (user) => {
		return User.findByIdAndRemove(req.userId);
	};
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	User.findOneById(req.userId)
		.then(comparePassword)
		.then(findAndRemove)
		.then(showSuccess)
		.catch(showError);
};

/*
 * AUTH
 */
/**
 * [signup description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.signup = (req, res, next) => {
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	User.createOne(req.body)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [login description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.login = (req, res, next) => {
	const select = 'email username avatar description password';
	const comparePassword = (user) => {
		return new Promise ((resolve, reject) => {
			bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
				if (err || isMatch != true)
					reject(err);
				else
					resolve(user);
			});
		});
	};
	const createToken = (user) => {
		return new Promise ((resolve, reject) => {
			let t = token.createJwtToken(user._id);
			if (t.length == 0)
				reject({
					'message': 'Impossible de se connecter pour le moment veuillez réessayer ulterieurement'
				});
			resolve({
				'userId': user._id,
				'token': t
			});
		});
	};
	const showSuccess = (data) => {
		console.log('success');
		res.send(200, data);
	};
	const showError = (err) => {
		console.log('error');
		res.send(400, err);
	};
	User.findOneByEmail(req.body.email, select)
		.then(comparePassword)
		.then(createToken)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [userExist description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.userExist = (req, res, next) => {
	const sendEmail = (params) => {
		return new Promise((resolve, reject) => {
			console.log(config.sendgrid.api_key);
			const sendgrid = require('sendgrid')(config.sendgrid.api_key);
			sendgrid.send({
				to:       params.to,
				from:     'contact@readlist.fr',
				subject:  params.subject,
				html:     params.html
			}, function (err, json) {
				console.log(err);
				if (err) { reject({'message':'Mail non envoyé'}) }
				resolve({'message':'Mail envoyé'});
			});
		});
	};
	const pimpEmailForValidation = (user) => {
		return new Promise((resolve, reject) => {
			var params = {};
			params.to = user.email;
			params.subject = "Insciption Readlist";
			params.html = "http://localhost:8080/auth/getMail/" + user._id;
			resolve(params);
		});
	}
	const userFound = (user) => {
		return new Promise((resolve, reject) => {
			resolve({'message':'Utilisateur trouvé, vous pouvez vous connecter'});
		});
	};
	const checkValidation = () => {
		return Validation.findOneByEmail(req.params.email)
			.then(Validation.removeOne)
			.then(createValidation)
			.catch(createValidation);
	};
	const createValidation = () => {
		return Validation.createOne(req.params.email)
			.then(pimpEmailForValidation)
			.then(sendEmail)
			.then(showSuccess)
			.catch(showError);
	};
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	User.findOneByEmail(req.params.email)
		.then(userFound)
		.then(showSuccess)
		.catch(checkValidation);
};
/**
 * [userExist description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getMail = (req, res, next) => {
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Validation.findOneById(req.params.id)
		.then(showSuccess)
		.catch(showError);
};

/*
 * ADMIN
 */
/**
 * [getAdmins description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getAdmins = (req, res) => {
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	User.findAllAdmins()
		.then(showSuccess)
		.catch(showError);
};

/*
 * GET USERS SOCIAL
 */
/**
 * [getUserReadlists description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getUserReadlists = (req, res) => {
	const params = {
		'view': -1
	};
	let array = [req.userId];

	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Readlist.findSpecificByUserId(params, array, req.query.limit, req.query.offset)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getUserLikes description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getUserLikes = (req, res) => {
	const params = {
		'view': -1
	};
	let array = [req.userId];

	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Readlist.findSpecificByLikesList(params, array, req.query.limit, req.query.offset)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getUserShares description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getUserShares = (req, res) => {
	const params = {
		'view': -1
	};
	const array = [req.userId];

	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	Readlist.findSpecificBySharesList(params, array, req.query.limit, req.query.offset)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [getUserHistory description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getUserHistory = (req, res) => {
	res.send({
		id: req.query.userId,
		name: "The Name",
		description: "description"
	});
};

/*
 * FRIENDS
 */
/**
 * [getUserFriends description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getUserFriends = (req, res, next) => {
	const showSuccess = (data) => {
		res.send(200, data);
	};
	const showError = (err) => {
		res.send(400, err);
	};
	User.findById(req.query.userId, 'friendsListId')
		.then(showSuccess)
		.catch(showError);
};
/**
 * [addFriends description]
 * @param {[type]}   req  [description]
 * @param {[type]}   res  [description]
 * @param {Function} next [description]
 */
exports.addFriends = (req, res, next) => {
	const checkUser = (user) => {
		return new Promise((resolve, reject) => {
			if (req.body.userId == req.userId) 
				reject({'message': 'You cannot add yoursel to friends'});
			else
				resolve(user);
		});
	};
	const addUser = (user) => {
		return new Promise((resolve, reject) => {
			user.friendsListId.push(req.body.userId);
			user.save((err) => {
				if (err) 
					reject({
						'message': 'Friend not added'
					});
				else
					resolve({
						'message': 'Friend added'
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
	User.findById(req.userId)
		.then(checkUser)
		.then(addUser)
		.then(showSuccess)
		.catch(showError);
};
/**
 * [deleteFriends description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.deleteFriends = (req, res, next) => {
	const checkUser = (user) => {
		return new Promise((resolve, reject) => {
			if (req.body.userId == req.userId) 
				reject({'message': 'You cannot delete yoursel to friends'});
			else
				resolve(user);
		});
	};
	const deleteUser = (user) => {
		return new Promise((resolve, reject) => {
			let index = user.friendsListId.indexOf(req.body.userId);
			user.friendsListId.splice(index, 1);
			user.save((err) => {
				if (err) 
					reject({
						'message': 'Friend not deleted'
					});
				else
					resolve({
						'message': 'Friend deleted'
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
	User.findById(req.userId)
		.then(checkUser)
		.then(deleteUser)
		.then(showSuccess)
		.catch(showError);
};
