'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

// 뷰 엔진 셋업
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// logging
switch(app.get('env')){
    case 'development':
    // compact, colorful dev logging
        app.use(require('morgan')('dev'));
    break;
    case 'production':
    // module 'express-logger' supports daily log rotation
        app.use(require('express-logger')({ path: __dirname + '/log/requests.log'}));
    break;
}

// 세션 설정
var expressSession = require('express-session');
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'useful property snow broke'
}));

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 포스트 겟 라우트 설정
require('./routes.js')(app);

// 리액트 라우트 설정
app.get('*', function(req, res, next){
    res.render('index')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.listen(3030)
