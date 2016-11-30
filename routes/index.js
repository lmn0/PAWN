var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs');
});

module.exports = router;


router.get('/project',function(req,res,next){
    res.render('project.ejs')
})