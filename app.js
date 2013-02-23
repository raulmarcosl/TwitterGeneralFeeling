
/**
 * Module dependencies.
 */

 "use strict";

var express, routes, index, user, http, path, Twitter, OAuth, app, oa, util;

express = require('express');
index = require('./routes/index');
routes = require('./routes');
user = require('./routes/user');
http = require('http');
path = require('path');
Twitter = require('twitter');
OAuth = require('oauth').OAuth;
app = express();
util = require('util');

oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    "acxVDBo5pbNEHjZOPaWa8w",
    "MwC2uh45dprfWqmQd1lPXdWB3QiWC4QW5Fkxcw",
    "1.0",
    "http://localhost:8080/auth/twitter/callback",
    "HMAC-SHA1"
);

app.use(express.cookieParser());
app.use(express.session({secret: 'blahblahblah'}));

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', index.showTweets);

app.get('/users', user.list);

app.get('/auth/twitter', function (req, res) {
    oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
        if (error) {
            console.log(error, "error");
            res.send("yeah no. didn't work.");
        } else {
            req.session.oauth = {};
            req.session.oauth.token = oauth_token;
            console.log('oauth.token: ' + req.session.oauth.token);
            req.session.oauth.token_secret = oauth_token_secret;
            console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
            res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token);
        }
    });
});

app.get('/auth/twitter/callback', function (req, res, next) {
    var oauth, twit;
    var homeline, self = this;

    if (req.session.oauth) {
        req.session.oauth.verifier = req.query.oauth_verifier;
        oauth = req.session.oauth;

        oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier, function (error, oauth_access_token, oauth_access_token_secret, results) {
            if (error) {
                console.log(error, "error");
                res.send("yeah something broke.");
            } else {
                req.session.oauth.access_token = oauth_access_token;
                req.session.oauth.access_token_secret = oauth_access_token_secret;
                console.log("<<<<<RESULTS: ", results);
                twit = new Twitter({
                    consumer_key: 'acxVDBo5pbNEHjZOPaWa8w',
                    consumer_secret: 'MwC2uh45dprfWqmQd1lPXdWB3QiWC4QW5Fkxcw',
                    access_token_key: oauth_access_token,
                    access_token_secret: oauth_access_token_secret
                });
 
                twit.get('https://api.twitter.com/1.1/search/tweets.json',
                    {
                        q:'Complutense',
                        include_entities: 'false',
                        count: "2"
                    }, 
                    function(data) {
                        console.log(util.inspect(data.statuses[0].text));
                    });
            }
        });
    } else {
        next(new Error("you're not supposed to be here."));
    }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
