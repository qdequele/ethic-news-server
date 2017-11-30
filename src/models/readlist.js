/*
 * Bundle: Models - Readlist
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tools = require('../helpers/tools');

var readlistSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	name: {
		type: String,
		default: '',
		require: true
	},
	description: {
		type: String,
		default: ''
	},
	image: {
		type: String,
		default: ''
	},
	storiesId: [{
		type: Schema.Types.ObjectId,
		ref: 'Story'
	}],
	keywords: {
		type: [String],
		default: '[]'
	},
	draft: {
		type: Boolean,
		default: true
	},
	needPremium: {
		type: Boolean,
		default: false
	},
	creationDate: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	},
	readTime: {
		type: Number,
		default: 0
	},
	view: {
		type: Number,
		default: 0
	},
	likes: {
		type: Number,
		default: 0
	},
	likesList: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	shares: {
		type: Number,
		default: 0
	},
	sharesList: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
});

readlistSchema.statics = {
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
				}, select)
				.lean()
				.populate('userId')
				.populate('storiesId')
				.exec(function(err, data) {
					if (err) reject(err);
					resolve(data);
				});
		});
	},
	/**
	 * [findSpecificByUserId description]
	 * @param  {[type]} params [description]
	 * @param  {[type]} array  [description]
	 * @param  {[type]} limit  [description]
	 * @param  {[type]} offset [description]
	 * @return {[type]}        [description]
	 */
	findSpecificByUserId: function(params, array, limit, offset) {
		return new Promise((resolve, reject) => {
			this.find({
					userId: {
						$in: array
					}
				})
				.sort(params)
				.lean()
				.limit(limit)
				.skip(offset)
				.populate('userId')
				.exec(function(err, data) {
					if (err)
						reject(err);
					for (var i = 0; i < data.length; i++) {
						data[i].creationDate = tools.formatDate(data[i].creationDate);
					}
					resolve(data);
				});
		});
	},
	/**
	 * [findSpecificByPageId description]
	 * @param  {[type]} params [description]
	 * @param  {[type]} array  [description]
	 * @param  {[type]} limit  [description]
	 * @param  {[type]} offset [description]
	 * @return {[type]}        [description]
	 */
	findSpecificByPageId: function(params, array, limit, offset) {
		return new Promise((resolve, reject) => {
			this.find({})
				.sort(params)
				.lean()
				.limit(limit)
				.skip(offset)
				.populate('userId')
				.populate('storiesId', null, {
					pageId: {
						$in: array
					}
				})
				.exec(function(err, data) {
					if (err)
						reject(err);
					resolve(data);
				});
		});
	},
	/**
	 * [findSpecificByLikesList description]
	 * @param  {[type]} params [description]
	 * @param  {[type]} array  [description]
	 * @param  {[type]} limit  [description]
	 * @param  {[type]} offset [description]
	 * @return {[type]}        [description]
	 */
	findSpecificByLikesList: function(params, array, limit, offset) {
		return new Promise((resolve, reject) => {
			this.find({})
				.sort(params)
				.lean()
				.limit(limit)
				.skip(offset)
				.populate('userId')
				.populate('likesList', null, {
					_id: {
						$in: array
					}
				})
				.exec(function(err, data) {
					if (err)
						reject(err);
					resolve(data);
				});
		});
	},
	/**
	 * [findSpecificBySharesList description]
	 * @param  {[type]} params [description]
	 * @param  {[type]} array  [description]
	 * @param  {[type]} limit  [description]
	 * @param  {[type]} offset [description]
	 * @return {[type]}        [description]
	 */
	findSpecificBySharesList: function(params, array, limit, offset) {
		return new Promise((resolve, reject) => {
			this.find({})
				.sort(params)
				.lean()
				.limit(limit)
				.skip(offset)
				.populate('userId')
				.populate('sharesList', null, {
					_id: {
						$in: array
					}
				})
				.exec(function(err, data) {
					if (err)
						reject(err);
					resolve(data);
				});
		});
	},
	/**
	 * [findAll description]
	 * @param  {[type]} params [description]
	 * @param  {[type]} limit  [description]
	 * @param  {[type]} offset [description]
	 * @return {[type]}        [description]
	 */
	findAll: function(params, limit, offset) {
		return new Promise((resolve, reject) => {
			this.find({})
				.sort(params)
				.lean()
				.limit(limit)
				.skip(offset)
				.populate('userId')
				.exec(function(err, data) {
					if (err)
						reject(err);
					for (var i = 0; i < data.length; i++) {
						data[i].creationDate = tools.formatDate(data[i].creationDate);
					}
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
			this.create(params, function(err, data) {
				if (err) reject(err);
				resolve(data);
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
			}, params, function(err, data) {
				if (err) reject(err);
				resolve(data);
			})
		});
	},
	/**
	 * [removeById description]
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	removeById: function(id) {
		return new Promise((resolve, reject) => {
			this.remove({
				_id: id
			}, function(err, data) {
				if (err)
					reject(err)
				resolve(data);
			});
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


mongoose.model('Readlist', readlistSchema);