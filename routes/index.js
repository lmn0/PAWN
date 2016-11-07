var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs');
});

router.get('/index', function(req, res, next) {
  res.render('index.ejs');
});
router.get('/dashboard',function(req,res,next){
	res.render('dashboard.ejs')
})

router.get('/drag1',function(req,res,next){
	res.render('drag1.ejs')
})

router.get('/user',function(req,res,next){
	res.render('user.ejs')
})



module.exports = router;
