var express = require('express');
var router = express.Router();
var stormpath=require('express-stormpath');


/* GET users listing. */
router.get('/',function(req,res,next){
	res.render('user.ejs')
})

module.exports = router;
