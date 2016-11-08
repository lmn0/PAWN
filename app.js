var express = require('express');
var path = require('path');
var stormpath =require('express-stormpath');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
//MIDDLEWARE
//Sessions
app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }*/
      // finishing processing the middleware and run the route
      //ROUTE SETUP
		//Static
		app.use(express.static(path.join(__dirname, 'public')));
		//Routes
		app.use('/', require('./routes/index.js'));
		app.use('/users', require('./routes/users/users.js'));
		app.use('/dashboard',require('./routes/dashboard/dashboard.js'));
		app.use('/workspace',require('./routes/workspace/dragdrop.js'));/*
      next();
    });
  } else {
    next();
  }
});*/

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", ['GET','DELETE','PUT', 'POST']);
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			return next();
		});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
