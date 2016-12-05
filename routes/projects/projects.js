var express = require('express');
var router = express.Router();
var DB = require('../../lib/msgqueue/rabbit.js');
		
/* GET users listing. */
router.get('/',function(req,res,next){

	res.render('project.ejs')
})



router.post('/add_project',function(req,res,next){

	
})



module.exports = router;
