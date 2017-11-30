/*
 * Bundle: Routes - Folder
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const folder = require('../handlers/folder');
const middleware = require('../helpers/middleware');

const authMid = middleware.ensureAuthenticated;
const adminMid = [middleware.ensureAuthenticated, middleware.ensureAdmin];

module.exports = (app) => {
	app.param('folder_id', folder.load);
	//INFORMATION
	app.post('/folder', adminMid, folder.createFolder);
	app.put('/folder/:folder_id', adminMid, folder.modifyFolder);
	app.delete('/folder/:folder_id', adminMid, folder.deleteFolder);
	app.get('/folder/:folder_id', folder.getFolder);
	//GETTERS
	app.get('/folder/view/:max/:offset', folder.getViewFolders);
	app.get('/folder/date/:max/:offset', folder.getDateFolders);
};