/*
 * Bundle: Models - Validation
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var validationSchema = new Schema({
	email: {
		type: String,
	}
});

validationSchema.statics = {
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
				}, "email")
				.lean()
				.exec(function(err, user) {
					if (err || user == null || user == undefined) reject(new Error('Id not found'));
					resolve(user);
				});
		});
	},
	/**
	 * [findOneById description]
	 * @param  {[type]} id     [description]
	 * @param  {[type]} select [description]
	 * @return {[type]}        [description]
	 */
	findOneByEmail: function(email, select) {
		return new Promise((resolve, reject) => {
			this.findOne({
					'email': email
				})
				.lean()
				.exec(function(err, user) {
					if (err || user == null || user == undefined) reject(new Error('Id not found'));
					resolve(email);
				});
		});
	},
	/**
	 * [createOne description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	createOne: function(param) {
		return new Promise((resolve, reject) => {
			this.create({
					'email': param
				}, function(err, user) {
				if (err || user == null || user == undefined) reject('User not created');
				resolve(user);
			});
		});
	},
	/**
	 * [removeOne description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	removeOne: function(param) {
		return new Promise((resolve, reject) => {
			this.remove({
					'email': param
				}, function(err, user) {
				if (err || user == null || user == undefined) reject('User not removed');
				resolve(param);
			});
		});
	}
};

mongoose.model('Validation', validationSchema);
