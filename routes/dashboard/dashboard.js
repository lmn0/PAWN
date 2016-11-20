var express = require('express');
var router = express.Router();
var stormpath=require('express-stormpath');
var stripe=require('stripe')("sk_test_g3WF6wdXVLB5GHA2bAgmW3RU");

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));



router.get('/',stormpath.loginRequired,function(req,res,next){
console.log('User:',req.user.email,'jsut accessed the /home page');

res.render('dashboard',{
    user:req.user.username,
    email:req.user.email
}
           );
next();
});



router.post('/hi', function(req, res) {
  if (!req.user.customData.billingTier || req.user.customData.billingTier.id !== 'pro') {
    res.status(402).json({ error: 'Please Upgrade to the pro plan' });
  } else {
    res.status(200).json({ hi: 'there' });
  }
});


module.exports = router;
