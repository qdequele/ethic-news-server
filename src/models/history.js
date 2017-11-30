/*
 * Bundle: Models - History
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var historySchema = new Schema({
	userId: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	readlistId: {
		type: Schema.ObjectId,
		ref: 'Readlist'
	},
	startReading: {
		type: Date,
		default: Date.now
	},
	stopReading: {
		type: Date,
		default: Date.now
	},
	duration: {
		type: Number,
		default: 0
	},
	numbersOfStoryRead: {
		type: Number,
		default: 0
	},
	isFinished: {
		type: Boolean,
		default: false
	}
});

mongoose.model('History', historySchema);