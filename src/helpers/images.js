/*
 * Bundle: Helpers - Image
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";
const fs = require('fs');
const AWS = require('aws-sdk');

const config = require('../config/config');

AWS.config.loadFromPath('../config/amazon.json');
/**
 * [savePicture description]
 * @param  {[type]} sourceFile [description]
 * @return {[type]}            [description]
 */
exports.savePicture = function(sourceFile) {
	var deferred = Promise.defer();
	var s3 = new AWS.S3();
	var filename = sourceFile.replace(/^.*[\\\/]/, '');
	fs.readFile(sourceFile, function(err, file_buffer) {
		var params = {
			Bucket: config.awsBucket,
			Key: filename,
			Body: file_buffer,
			ACL: 'public-read',
			ContentType: 'image/jpeg'
		};

		s3.putObject(params, function(perr, pres) {
			fs.unlink(sourceFile);
			if (perr) {
				deferred.reject(new Error('fail to upload file'));
			}
			if (pres) {
				deferred.resolve("http://" + config.awsBucket + "/" + filename);
			}
		});
	});
	return deferred.promise;

}