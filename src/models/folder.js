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

var folderSchema = new Schema({
	name: {
		type: String,
		default: '',
		require: true
	},
	image: {
		type: String,
		default: ''
	},
	readlistsId: [{
		type: Schema.Types.ObjectId,
		ref: 'Readlist'
	}],
	creationDate: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	},
	view: {
		type: Number,
		default: 0
	}
});

folderSchema.statics = {
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
				.populate('readlistsId')
				.exec(function(err, data) {
					if (err) reject(err);
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
				.populate('readlistsId')
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

mongoose.model('Folder', folderSchema);