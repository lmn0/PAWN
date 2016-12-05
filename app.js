var express = require('express');
var path = require('path');
var stormpath =require('express-stormpath');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var stripe=require('stripe')("sk_test_g3WF6wdXVLB5GHA2bAgmW3RU");
var session=require('express-session');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.locals.stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

//MIDDLEWARE
//Sessions
app.use(cookieParser('cdERer$5&73csdg82#voopsm(&te'));
app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));
/*
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
      /*
      next();
    });
  } else {
    next();
  }
});*/

app.use(logger('dev'));
app.use(cookieParser());
app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", ['GET','DELETE','PUT', 'POST']);
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			return next();
		});



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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//ROUTE SETUP
		//Static
		app.use(express.static(path.join(__dirname, 'public')));
		//Routes
		app.use('/', require('./routes/index.js'));
		app.use('/users', stormpath.loginRequired, require('./routes/users/users.js'));
		app.use('/dashboard',  require('./routes/dashboard/dashboard.js'));
		app.use('/workspace',  require('./routes/workspace/dragdrop.js'));
		app.use('/projects', require('./routes/projects/projects.js'));


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
