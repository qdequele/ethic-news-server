/*
 * Bundle: Models - Page
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const mongoose = require('mongoose');

(t)

var pageSchema = new Schema({
	name: {
		type: String,
		default: ''
	},
	avatar: {
		type: String,
		default: ''
	},
	description: {
		type: String,
		default: ''
	},
	hostname: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	creationDate: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	},
	blacklisted: {
		type: Boolean,
		default: false
	},
	paying: {
		type: Boolean,
		default: false
	},
	views: {
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

pageSchema.statics = {
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
				.exec(function(err, page) {
					if (err) reject(err);
					resolve(page);
				});
		});
	},
	/**
	 * [findOneByHostname description]
	 * @param  {[type]} hostname [description]
	 * @return {[type]}          [description]
	 */
	findOneByHostname: function(hostname) {
		return new Promise((resolve, reject) => {
			this.findOne({
					'hostname': hostname
				})
				.lean()
				.exec(function(err, page) {
					if (err || page == null || page == undefined) reject(err);
					resolve(page);
				});
		});
	},
	/**
	 * [createOne description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	createOne: function(data) {
		return new Promise((resolve, reject) => {
			this.create(data, function(err, p) {
				if (err) reject(err);
				resolve(p);
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
			}, params, function(err, p) {
				if (err) reject(err);
				resolve(p);
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

mongoose.model('Page', pageSchema);