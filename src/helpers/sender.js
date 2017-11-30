/*
 * Bundle: Helpers - Sender
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */



exports.showSuccess = (data, res) => {
	console.log('sucess');
	res.send(200, req.folder);
};
exports.showError = (err, res) => {
	console.log('error');
	res.send(400, err);
};
