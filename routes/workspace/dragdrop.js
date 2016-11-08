var express = require('express');
var router = express.Router();

//GET Req
router.get('/',function(req,res,next){
	res.render('drag1.ejs')
})


//POST Req
router.get('/create-system',function(req,res,next){
	var createsystem = require('../../lib/msgqueue/rabbit.js');
	//Create system with the recieved variables
	var options = "Hey Tjs";
	createsystem.sendData(options);
	res.redirect('/dashboard');
})

module.exports = router;