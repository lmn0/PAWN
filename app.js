var express = require('express');
var path = require('path');
var stormpath =require('express-stormpath');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
var async=require('async');
var stripe=require('stripe')("sk_test_g3WF6wdXVLB5GHA2bAgmW3RU");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.engine('jade', require('jade').__express);

app.locals.stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;


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
  debug:'info',
    expand:{
        apiKeys:true,
        customData:true
    },
  web:{
      register:{
      enabled:true,
          uri:'/signup',
          nextUri:'/login',
          form:{
            fields:{
              orgName:{
                enabled:true,
                label:'Organisation Name',
                required:true,
                type:'text'
              }  ,
              orgDesc:{
                enabled:true,
                label:'Organisation Description',
                required:true,
                type:'text'
              },
              dirName:{
                enabled:true,
                label:'Directory Name',
                required:true,
                type:'text'
              },
              dirDesc:{
                enabled:true,
                label:'Directory Description',
                required:true,
                type:'text'
              }
            }
          }
  },
      login:{
          nextUri:'/dashboard'
      }
  },
  preRegistrationHandler: function (formData, req, res, next) {
    console.log(req.query.valid)
    console.log('Got registration request', formData)
    var newOrganization = {
   name: formData.orgName,
   nameKey: formData.orgDesc
 };

    
    next()
     },
     postRegistrationHandler: function (account, req, res, next) {
       var client = req.app.get('stormpathClient');
    console.log('User:', account.email, 'just registered!');
    async.parallel([
        function(cb){
            account.createApiKey(function(err,key){
                if(err) return cb(err);
                cb();
            })
        }
    ],function(err){
        if(err) return next(err);

    })
     account.customData.subscriber='admin'
     account.customData.customer_id=req.query.valid
     account.customData.save();
    console.log(account.customData.subscriber)
    console.log(account.customData.orgName)



    //res.sendfile('views/paypal.jade')
    next();
  },
    preLoginHandler: function (formData, req, res, next) {
    if (formData.login.indexOf('something') !== -1) {
      return next(new Error('You\'re not allowed to login with \'@\'.'));
    }

    next();
  },
    postLoginHandler: function (account, req, res, next) {
    console.log('User:', account.email, 'just logged in!');

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
