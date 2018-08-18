const config = require('./src/cfg/config');
const database = require('./src/cfg/database');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const request = require('request');
const handlebars = require('handlebars');
const _ = require('lodash');
const tmi = require('tmi.js');
const INDICATOR = '!';

// Initialize Express and middlewares
const start = () => {
  const app = express();
  app.use(session({ secret: config.twitch.sessionSecret, resave: false, saveUninitialized: false }));
  app.use(express.static('public'));
  app.use(passport.initialize());
  app.use(passport.session());

// Override passport profile function to get user profile from Twitch API
  OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
    const options = {
      url: 'https://api.twitch.tv/kraken/user',
      method: 'GET',
      headers: {
        'Client-ID': config.twitch.clientId,
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Authorization': 'OAuth ' + accessToken
      }
    };

    request(options, function(error, response, body) {
      if (response && response.statusCode == 200) {
        done(null, JSON.parse(body));
      } else {
        done(JSON.parse(body));
      }
    });
  };

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use('twitch', new OAuth2Strategy({
      authorizationURL: 'https://api.twitch.tv/kraken/oauth2/authorize',
      tokenURL: 'https://api.twitch.tv/kraken/oauth2/token',
      clientID: config.twitch.clientId,
      clientSecret: config.twitch.secret,
      callbackURL: config.twitch.callbackUrl,
      state: true
    },
    function(accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;

      // Securely store user profile in your DB
      //User.findOrCreate(..., function(err, user) {
      //  done(err, user);
      //});

      done(null, profile);
    }
  ));

// Set route to start OAuth link, this is where you define scopes to request
  app.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read chat_login' }));

// Set route for OAuth redirect
  app.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }));

// Define a simple template to safely generate HTML with values from user's profile
  const template = handlebars.compile(`
<html><head><title>Twitch Auth Sample</title></head>
<table>
    <tr><th>Access Token</th><td>{{accessToken}}</td></tr>
    <tr><th>Refresh Token</th><td>{{refreshToken}}</td></tr>
    <tr><th>Display Name</th><td>{{display_name}}</td></tr>
    <tr><th>Bio</th><td>{{bio}}</td></tr>
    <tr><th>Image</th><td>{{logo}}</td></tr>
</table></html>`);

// If user has an authenticated session, display it, otherwise display link to authenticate
  app.get('/', function(req, res) {
    if (req.session && req.session.passport && req.session.passport.user) {
      res.send(template(req.session.passport.user));
    } else {
      res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch"><img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png"></a></html>');
    }
  });

  app.listen(3000, function() {
    console.log('Twitch auth sample listening on port 3000!')
  });

  const options = {
    options: {
      debug: true,
    },
    connection: {
      reconnect: true
    },
    identity: {
      username: 'AQuietTownCalledTwitch',
      password: 'oauth:dpv9tq71h6patpmuetjp92ay1ck7xs',
    },
    channels: ["#thorsus"]
  };

  const client = new tmi.client(options);
  const messageHandler = require('./src/handlers/messageHandler')(client);

  client.on("message", (channel, userstate, message, self) => {
    // Don't respond to self messages
    if (self) {
      return;
    }
    const messageType = userstate["message-type"];

    if (messageType === 'chat' && _.startsWith(message, INDICATOR)) {
      messageHandler.handleMessage(channel, userstate, message);
    }
  });

// Connect the client to the server..
  client.connect();
};

database.connect(config.mongo.url, (error) => {
  if (error) {
    console.log('Could not connect to mongodb');
    process.exit(1);
  } else {
    console.log('Mongo connected');
    start();
  }
});
