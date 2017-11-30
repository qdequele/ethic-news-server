/*
 * Bundle: Helpers - Mailer
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const config = require('../config/config');
const sendgrid  = require('sendgrid')(config.sendgrid);

const sendEmail = (params) => {
	console.log("sendEmail");
	return new Promise((resolve, reject) => {
		sendgrid.send({
			to:       params.to,
			from:     'contact@readlist.fr',
			subject:  params.subject,
			html:     params.html
		}, function (err, json) {
			if (err) { reject({'message':'Mail non envoyé'}) }
			resolve({'message':'Mail envoyé'});
		});
	});
};

const pimpEmailForValidation = (user) => {
	console.log("pimpEmailForValidation");
	const pimp = (user) => {
		return new Promise((resolve, reject) => {
			var params = {};
			params.to = user.to;
			params.subject = "Insciption Readlist";
			params.html = "http://localhost:8080/auth/getMail/" + user._id;
			resolve(params);
		});
	};
	return pimp(user)
		.then(sendEmail)

}

