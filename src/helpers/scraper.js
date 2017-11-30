/*
 * Bundle: Helpers - Scraper
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const scraperjs = require('scraperjs');
const url = require('url');
const self = this;

/**
 * [scrapArticle description]
 * @param  {[type]} link [description]
 * @return {[type]}      [description]
 */
exports.scrapArticle = (link) => {
	var res = {
		"title": '',
		"image": ''
	}

	var scrapFacebook = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.title = $('meta[property="og:title"]').attr('content');
				if ($('meta[property="og:image"]').attr('content').length > 0)
					res.image = $('meta[property="og:image"]').attr('content');
				reject();
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapTwitter = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.title = $('meta[property="twitter:title"]').attr('content');
				if ($('meta[property="twitter:image"]').attr('content').length > 0)
					res.image = $('meta[property="twitter:image"]').attr('content');
				reject();
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapArticleH1 = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.title = $('article h1').text();
				res.image = $('article img').attr("src");
				if (res.title.length == 0) resolve($);
				else reject();
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapArticleH2 = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.title = $('article h2').text();
				res.image = $('article img').attr("src");
				if (res.title.length == 0) resolve($);
				else reject();
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrap_ArticleH1 = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.title = $('.article h1').text();
				res.image = $('.article img').attr("src");
				if (res.title.length == 0) resolve($);
				else reject();
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrap_ArticleH2 = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.title = $('.article h2').text();
				res.image = $('.article img').attr("src");
				if (res.title.length == 0) resolve($);
				else reject();
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrap_MainH1 = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.title = $('#main h1').text();
				res.image = $('#main img').attr("src");
				if (res.title.length == 0) resolve($);
				else reject();
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrap_MainH2 = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.title = $('#main h2').text();
				res.image = $('#main img').attr("src");
				if (res.title.length == 0) resolve($);
				else reject();
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrap_ContentH1 = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.title = $('#content h1').text();
				res.image = $('#content img').attr("src");
				if (res.title.length == 0) resolve($);
				else reject();
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrap_ContentH2 = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.title = $('#content h2').text();
				res.image = $('#content img').attr("src");
				if (res.title.length == 0) resolve($);
				else reject();
			} catch (err) {
				resolve($);
			}
		});
	};

	return new Promise((resolve, reject) => {
		scraperjs.StaticScraper.create(link)
			.scrape(($) => {
				scrapFacebook($)
					.then(scrapFacebook)
					.then(scrapTwitter)
					.then(scrapArticleH1)
					.then(scrapArticleH2)
					.then(scrap_ArticleH1)
					.then(scrap_ArticleH2)
					.then(scrap_MainH1)
					.then(scrap_MainH2)
					.then(scrap_ContentH1)
					.then(scrap_ContentH2)
					.then(($) => {
						reject("Article not found");
					})
					.catch(() => {
						resolve(res);
					});
			});
	});
};
/**
 * [scrapMedia description]
 * @param  {[type]} link [description]
 * @return {[type]}      [description]
 */
exports.scrapMedia = (link) => {
	var res = {
		name: '',
		avatar: '',
		description: ''
	}
	var scrapNameChain = ($) => {
		return new Promise((resolve, reject) => {
			scrapNameFacebook($)
				.then(scrapNameApplicationName)
				.then(scrapNameMSApplicationTooltip)
				.then(scrapNameTwitterAppNameIphone)
				.then(scrapNameOwner)
				.then(scrapNameAlIosAppName)
				.then(scrapNameAlAndroidAppName)
				.then(scrapNameTitle)
				.catch(($) => {
					resolve($);
				});
		});
	};
	var scrapNameFacebook = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.name = $('meta[property="og:site_name"]').attr('content');
				if (res.name.length == 0) resolve($);
				else reject($);
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapNameApplicationName = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.name = $('meta[name="application-name"]').attr('content');
				if (res.name.length == 0) resolve($);
				else reject($);
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapNameMSApplicationTooltip = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.name = $('meta[name="msapplication-tooltip"]').attr('content');
				if (res.name.length == 0) resolve($);
				else reject($);
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapNameTwitterAppNameIphone = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.name = $('meta[name="twitter:app:name:iphone"]').attr('content');
				if (res.name.length == 0) resolve($);
				else reject($);
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapNameOwner = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.name = $('meta[name="owner"]').attr('content');
				if (res.name.length == 0) resolve($);
				else reject($);
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapNameAlIosAppName = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.name = $('meta[name="al:ios:app_name"]').attr('content');
				if (res.name.length == 0) resolve($);
				else reject($);
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapNameAlAndroidAppName = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.name = $('meta[name="al:android:app_name"]').attr('content');
				if (res.name.length == 0) resolve($);
				else reject($);
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapNameTitle = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.name = $('title').text();
				if (res.name.length == 0) reject($);
				else reject($);
			} catch (err) {
				reject($);
			}
		});
	};

	var scrapDescriptionChain = ($) => {
		return new Promise((resolve, reject) => {
			scrapDescriptionFacebook($)
				.then(scrapDescriptionTwitter)
				.then(scrapDescriptionSite)
				.catch(($) => {
					resolve($);
				});
		});
	};
	var scrapDescriptionFacebook = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.description = $('meta[name="og:description"]').attr('content');
				if (res.description.length == 0) resolve($);
				else reject($);
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapDescriptionTwitter = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.description = $('meta[name="twitter:description"]').attr('content');
				if (res.description.length == 0) resolve($);
				else reject($);
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapDescriptionSite = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.description = $('meta[name="description"]').attr('content');
				if (res.description.length == 0) reject($);
				else reject($);
			} catch (err) {
				reject($);
			}
		});
	};

	var scrapAvatarChain = ($) => {
		return new Promise((resolve, reject) => {
			scrapAvatarFacebook($)
				.then(scrapAvatarSite)
				.then(scrapAvatarAppleTouchIconPrecomposed)
				.catch(($) => {
					resolve($);
				});
		});
	};
	var scrapAvatarFacebook = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.avatar = $('meta[name="og:image"]').attr('content');
				if (res.avatar.length == 0) resolve($);
				else reject($);
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapAvatarSite = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.avatar = $('link[rel="icon"]').attr('href');
				if (res.avatar.length == 0) resolve($);
				else reject($);
			} catch (err) {
				resolve($);
			}
		});
	};
	var scrapAvatarAppleTouchIconPrecomposed = ($) => {
		return new Promise((resolve, reject) => {
			try {
				res.avatar = $('link[rel="apple-touch-icon-precomposed"]').attr('href');
				if (res.avatar.length == 0) reject($);
				else reject($);
			} catch (err) {
				reject($);
			}
		});
	};

	return new Promise((resolve, reject) => {
		scraperjs.StaticScraper.create(link)
			.scrape(($) => {
				scrapNameChain($)
					.then(scrapDescriptionChain)
					.then(scrapAvatarChain)
					.then(() => {
						resolve(res);
					})
					.catch((err) => {
						reject(err);
					});
			});
	});
};