var express = require('express');
var path = require('path');
var stormpath =require('express-stormpath');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('jade', require('jade').__express);



		
 

app.use(cookieParser('my 114 o2o'));
app.use(session({
  maxAge : 1000*60*60*24 ,
  secret:"1234",
  resave:true,
  saveUninitialized:true,
  cookie : {
    maxAge : 1000*60*60*24 // expire the session(-cookie) after
  }
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", ['GET','DELETE','PUT', 'POST']);
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			return next();
		});


app.use(express.static(path.join(__dirname, 'public')));
		//Routes
		app.use('/', require('./routes/index.js'));
		app.use('/user', require('./routes/user/user.js'));
		app.use('/dashboard',require('./routes/dashboard/dashboard.js'));
		app.use('/workspace',require('./routes/workspace/dragdrop.js'));

app.use(stormpath.init(app, {
  web:{
      login:{
          nextUri:'/paypal'
      }
  },
  preRegistrationHandler: function (formData, req, res, next) {
    console.log('Got registration request', formData)
     next();},

     postRegistrationHandler: function (account, req, res, next) {
    console.log('User:', account.email, 'just registered!');
    
    //res.sendfile('views/paypal.jade') 
    next();
  }
}));

 //catch 404 and forward to error handler
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
