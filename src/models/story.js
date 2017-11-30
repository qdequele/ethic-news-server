/*
 * Bundle: Models - Story
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var storySchema = new Schema({
	url: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	title: {
		type: String,
		default: ''
	},
	image: {
		type: String,
		//match: /(https?:\/\/.*\.(?:png|jpg))/i,
		default: ''
	},
	pageId: {
		type: Schema.Types.ObjectId,
		ref: 'Page'
	},
	creationDate: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	}
});

const publicData = 'url title image pageId creationDate';

storySchema.pre('update', function(next) {
	now = new Date();
	this.updateDate = now;
	if (!this.updateDate) {
		this.updateDate = now;
	}
	next();
});

storySchema.statics = {
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
				.exec(function(err, story) {
					if (err) reject(err);
					if (story == null || story == undefined) reject(new Error('Story not found'));
					resolve(story);
				});
		});
	},
	/**
	 * [findOneByUrl description]
	 * @param  {[type]} url    [description]
	 * @param  {[type]} select [description]
	 * @return {[type]}        [description]
	 */
	findOneByUrl: function(url, select) {
		return new Promise((resolve, reject) => {
			this.findOne({
					'url': url
				}, select || publicData)
				.lean()
				.exec(function(err, story) {
					if (err) reject(err);
					if (story == null || story == undefined) reject(new Error('Story not found'));
					resolve(story);
				});
		});
	},
	/**
	 * [createOne description]
	 * @param  {[type]} story [description]
	 * @return {[type]}       [description]
	 */
	createOne: function(story) {
		return new Promise((resolve, reject) => {
			this.create(story, function(err, s) {
				if (err) reject(err);
				if (s == null || s == undefined) reject(new Error('Story not created'));
				resolve(s);
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
			this.update({
				_id: id
			}, {
				$set: params
			}).exec(function(err) {
				if (err) reject(err);
				resolve();
			});
		});
	}
};

mongoose.model('Story', storySchema);