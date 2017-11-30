/*
 * Bundle: Routes - Page
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const page = require('../handlers/page');

const middleware = require('../helpers/middleware');

const authMid = middleware.ensureAuthenticated;
const adminMid = [middleware.ensureAuthenticated, middleware.ensureAdmin];

module.exports = (app) => {
	app.param('pageId', page.load);
	//INFORMATION
	app.get('/page/:pageId', page.pageInfo);
	app.post('/page', adminMid, page.createPage);
	app.put('/page/:pageId', adminMid, page.modifyPage);
	app.delete('/page/:pageId', adminMid, page.deletePage);
	app.get('/page/readlists/:pageId/:max/:offset', page.getReadlistOfPage);
	app.post('/page/scrap/url', page.getPageFromUrl);
	//SOCIAL
	app.get('/page/likes/:pageId', authMid, page.getLikesOfPage);
	app.post('/page/likes/:pageId', authMid, page.likesPage);
	app.delete('/page/likes/:pageId', authMid, page.unlikesPage);
	app.post('/page/shares/:pageId', authMid, page.sharePage);
};