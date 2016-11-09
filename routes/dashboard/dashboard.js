var express = require('express');
var router = express.Router();
var stormpath=require('express-stormpath');

router.get('/',stormpath.loginRequired,function(req,res,next){
	
	res.render('dashboard.ejs')
})

module.exports = router;