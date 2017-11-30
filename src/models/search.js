/*
 * Bundle: Models - Search
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var searchSchema = new Schema({
	text: {
		type: String,
		default: ''
	},
	name: {
		type: String,
		default: ''
	},
	pageId: {
		type: Schema.ObjectId,
		ref: 'Page'
	},
	userId: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	readlistId: {
		type: Schema.ObjectId,
		ref: 'Readlist'
	}
});

mongoose.model('Search', searchSchema);