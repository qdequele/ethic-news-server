/*
 * Bundle: Models - User
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

var userSchema = new Schema({
	email: {
		type 		: String,
	},
	password: {
		type 		: String,
		select 		: false
	},
	username: {
		type 		: String,
		lowercase 	: true
	},
	firstName: {
		type 		: String,
		default 	: ''
	},
	lastName: {
		type 		: String,
		default 	: ''
	},
	avatar: {
		type 		: String,
		default 	: ''
	},
	description: {
		type 		: String,
		default 	: ''
	},
	friends: {
		type 		: Number,
		default		: 0
	},
	friendsListId: [{
		type 		: Schema.Types.ObjectId,
		ref			: 'User'
	}],
	wallet: {
		type 		: Number,
		default		: 0.00
	},
	activated: {
		type 		: Boolean,
		default 	: false
	},
	admin: {
		type 		: Boolean,
		default 	: false
	},
	creationDate: {
		type 		: Date,
		default 	: Date.now
	},
	updateDate: {
		type 		: Date,
		default 	: Date.now
	},
	views: {
		type 		: Number,
		default 	: 0
	}
});

var publicData = 'email username avatar description friends';

userSchema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password')) return next();
	bcrypt.genSalt(10, function(err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(paramPassword) {
	console.log('comparePassword : %s | %s', paramPassword, this.password);
	return new Promise((resolve, reject) => {
		bcrypt.compare(paramPassword, this.password, function(err, isMatch) {
			if (err) reject(err);
			if (isMatch != true) reject(new Error('Password no match'));
			resolve();
		});
	});
};

userSchema.statics = {
	/**
	 * [findOneById description]
	 * @param  {[type]} id     [description]
	 * @param  {[type]} select [description]
	 * @return {[type]}        [description]
	 */
	findOneById: function(id, select) {
		return new Promise((resolve, reject) => {
			this.findOne({
					'_id': id
				}, select || publicData)
				.lean()
				.exec(function(err, user) {
					if (err) reject(err);
					console.log("user : " + user);
					console.log("error : " + err);
					if (user == null || user == undefined) reject(new Error('User not found'));
					resolve(user);
				});
		});
	},
	/**
	 * [findOneByUsername description]
	 * @param  {[type]} username [description]
	 * @param  {[type]} select   [description]
	 * @return {[type]}          [description]
	 */
	findOneByUsername: function(username, select) {
		return new Promise((resolve, reject) => {
			this.findOne({
					'username': username
				}, select || publicData)
				.lean()
				.exec(function(err, user) {
					if (err) reject(err);
					if (user == null || user == undefined) reject(new Error('User not found'));
					resolve(user);
				});
		});
	},
	/**
	 * [findOneByEmail description]
	 * @param  {[type]} email  [description]
	 * @param  {[type]} select [description]
	 * @return {[type]}        [description]
	 */
	findOneByEmail: function(email, select) {
		return new Promise((resolve, reject) => {
			this.findOne({
					'email': email
				}, select || publicData)
				.lean()
				.exec(function(err, user) {
					if (err || user == null || user == undefined) reject(new Error('User not found'));
					resolve(user);
				});
		});
	},
	/**
	 * [findAllAdmins description]
	 * @return {[type]} [description]
	 */
	findAllAdmins: function() {
		return new Promise((resolve, reject) => {
			this.find({
					admin: true
				}, '_id')
				.lean()
				.populate('userId')
				.exec(function(err, data) {
					if (err)
						reject(err);
					resolve(data);
				});
		});
	},
	/**
	 * [createOne description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	createOne: function(params) {
		return new Promise((resolve, reject) => {
			this.create(params, function(err, user) {
				if (err) reject(err);
				if (user == null || user == undefined) reject('User not created');
				resolve(user);
			});
		});
	},
	/**
	 * [updateOne description]
	 * @param  {[type]} id     [description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	updateOne: function(id, params) {
		return new Promise((resolve, reject) => {
			this.findOneAndUpdate({
				_id: id
			}, params, function(err, u) {
				if (err) reject(err);
				resolve(u);
			})
		});
	},
	/**
	 * [viewOneById description]
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	viewOneById: function(id) {
		return new Promise((resolve, reject) => {
			this.findByIdAndUpdate(id, {
				$inc: {
					view: 1
				}
			}, function(err) {
				if (err) {
					reject(err);
				}
				resolve();
			});
		});
	}
};

mongoose.model('User', userSchema);
