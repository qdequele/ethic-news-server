/*
 * Bundle: Routes - Auth
 * Project: Readlist - Server
 * Author: Quentin de Quelen <quentin@dequelen.me>
 * Copyright: 2015, Readlist
 */

"use strict";

const passport 		= require('passport');

module.exports = (app) => {
	app.post('/auth/passport/signup',
		passport.authenticate('local-signup', { session: false }),
			(req, res) => {
				res.send(200, req.user.local.email);
			}
	);

	app.post('/auth/passport/login', 
		passport.authenticate('local-login', { session: false }),
			(req, res) => {
				res.send(200, {'id': req.user._id});
			}
	);

	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', { session: false }), 
			(req, res) => {
				res.send(200, req.user);
			}
	);

	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', { session: false }), 
			(req, res) => {
				res.send(200, req.user);
			}
	);

	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
	app.get('/auth/google/callback',
		passport.authenticate('google', { session: false }), 
			(req, res) => {
				res.send(200, req.user);
			}
	);

	app.get('/auth/unlink/local', (req, res) => {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save((err) => {
            res.redirect('/profile');
        });
    });
    app.get('/auth/unlink/facebook', (req, res) => {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save((err) => {
            res.redirect('/profile');
        });
    });
    app.get('/auth/unlink/twitter', (req, res) => {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save((err) => {
           res.redirect('/profile');
        });
    });
    app.get('/auth/unlink/google', (req, res) => {
        var user          = req.user;
        user.google.token = undefined;
        user.save((err) => {
           res.redirect('/profile');
        });
    });
};