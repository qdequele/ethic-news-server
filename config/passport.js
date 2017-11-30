const LocalStrategy		= require('passport-local').Strategy;
const FacebookStrategy	= require('passport-facebook').Strategy;
const TwitterStrategy	= require('passport-twitter').Strategy;
const GoogleStrategy	= require('passport-google-oauth').OAuth2Strategy;

const Auth				= require('../models/auth');
const configAuth 		= require('./social');

module.exports = (passport)  => {
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	passport.deserializeUser((id, done) => {
		Auth.findById(id, (err, user) => {
			done(err, user);
		});
	});

	passport.use('local-signup', 
		new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true
		},(req, email, password, done) =>{
			process.nextTick(() => {
				Auth.findOne({ 'local.email' :  email }, (err, user) => {
					console.log(user);
					if (err)
						return done(err);
					if (user) {
						return done(err, user);
					} else {
						const newAuth          = new Auth();
						newAuth.local.email    = email;
						newAuth.local.password = newAuth.generateHash(password);
						newAuth.save((err) => {
							if (err)
								throw err;
							return done(null, newAuth);
						});
					}
				});    
			});
		})
	);

	passport.use('local-login',
		new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true 
		}, (req, email, password, done) => {
			Auth.findOne({ 'local.email' :  email }, (err, user) => {
				if (err)
					return done(err);
				if (!user)
					return done({'err': 'Utilisateur non trouvé'}, false);
				if (!user.validPassword(password))
					return done({'err': 'Mauvais mot de passe'}, false);
				return done(null, user);
			});
		})
	);

	passport.use(
		new FacebookStrategy({
			clientID        : configAuth.facebookAuth.clientID,
			clientSecret    : configAuth.facebookAuth.clientSecret,
			callbackURL     : configAuth.facebookAuth.callbackURL
		},
		(req, token, refreshToken, profile, done) => {
			if (!req.user) {
				process.nextTick(() => {
					Auth.findOne({ 'facebook.id' : profile.id }, (err, user) => {
						if (err)
							return done(err);
						if (user) {
							if (!user.facebook.token) {
								user.facebook.token = token;
								user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
								user.facebook.email = profile.emails[0].value;
								user.save((err) => {
									if (err)
										throw err;
									return done(null, user);
								});
							}
							return done(null, user);
						}
						else {
							var newUser            = new Auth();
							newUser.facebook.id    = profile.id;
							newUser.facebook.token = token;
							newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
							newUser.facebook.email = profile.emails[0].value;
							newUser.save((err) => {
								if (err)
									throw err;
								return done(null, newUser);
							});
						}
					});
				});
			}
			else {
				var user            = req.user;
				user.facebook.id    = profile.id;
				user.facebook.token = token;
				user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
				user.facebook.email = profile.emails[0].value;
				user.save((err) => {
					if (err)
						throw err;
					return done(null, user);
				});
			}
		}
	));

	passport.use(
		new TwitterStrategy({
			consumerKey     : configAuth.twitterAuth.consumerKey,
			consumerSecret  : configAuth.twitterAuth.consumerSecret,
			callbackURL     : configAuth.twitterAuth.callbackURL
		},
		(req, token, tokenSecret, profile, done) => {
			if (!req.user) {
				process.nextTick(() => {
					Auth.findOne({ 'twitter.id' : profile.id }, (err, user) => {
						if (err)
							return done(err);
						if (user) {
							if (!user.twitter.token) {
								user.twitter.token       = token;
								user.twitter.username    = profile.username;
								user.twitter.displayName = profile.displayName;
								user.save(function(err) {
									if (err)
										throw err;
									return done(null, user);
								});
							}

							return done(null, user);
						} else {
							var newUser                 = new Auth();
							newUser.twitter.id          = profile.id;
							newUser.twitter.token       = token;
							newUser.twitter.username    = profile.username;
							newUser.twitter.displayName = profile.displayName;
							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
						}
					});
				});
			}
			else {
				var user                 = req.user;
				user.twitter.id          = profile.id;
				user.twitter.token       = token;
				user.twitter.username    = profile.username;
				user.twitter.displayName = profile.displayName;
				user.save(function(err) {
					if (err)
						throw err;
					return done(null, user);
				});
			}
		})
	);
	passport.use(
		new GoogleStrategy({
			clientID        : configAuth.googleAuth.clientID,
			clientSecret    : configAuth.googleAuth.clientSecret,
			callbackURL     : configAuth.googleAuth.callbackURL,
		},
		(req, token, refreshToken, profile, done) => {
			if (!req.user) {
				process.nextTick(() => {
					Auth.findOne({ 'google.id' : profile.id }, (err, user) => {
						if (err)
							return done(err);
						if (user) {
							if (!user.google.token) {
								user.google.token = token;
								user.google.name  = profile.displayName;
								user.google.email = profile.emails[0].value;
								user.save(function(err) {
									if (err)
										throw err;
									return done(null, user);
								});
							}
							return done(null, user);
						} else {
							var newUser          = new Auth();
							newUser.google.id    = profile.id;
							newUser.google.token = token;
							newUser.google.name  = profile.displayName;
							newUser.google.email = profile.emails[0].value;
							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
						}
					});
				});
			}
			else {
				var user          = req.user;
				user.google.id    = profile.id;
				user.google.token = token;
				user.google.name  = profile.displayName;
				user.google.email = profile.emails[0].value;
				user.save(function(err) {
					if (err)
						throw err;
					return done(null, user);
				});
			}
		})
	);
};