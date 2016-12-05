var express = require('express');
var router = express.Router();
var stormpath=require('express-stormpath');
var stripe=require('stripe')("sk_test_g3WF6wdXVLB5GHA2bAgmW3RU");

var app=express();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));



router.get('/',function(req,res,next){
console.log('User:',req.user.email,'jsut accessed the /home page');

res.render('dashboard',{
    user:req.user.username,
    email:req.user.email
})
next();
});

// router.get('/create_user',stormpath.groupsRequired(['admin']),function(req,res,next){

// res.render('create_user.ejs')
// });

router.get('/create_user',stormpath.groupsRequired(['admin']),function(req,res,next){
//console.log('User:',req.user,'jsut accessed the /create user');
  var client = req.app.get('stormpathClient');
  //console.log(req.user.directory)
  var href_dir=req.user.directory.href
  client.getDirectory(href_dir,function(err,directory){
       //console.log(directory)
       var account = {
         givenName: 'Test',
         surname: 'Krish',
         username: 'teshkrish',
         email: 'teshkris@example.com',
         password: 'Changeme1!',
         customData:{
           role:'user',
           stripe_id:"goo_free"
         }
       };
       directory.getGroups(function (err, groupsCollection) {
         console.log(groupsCollection)
   groupsCollection.each(function(group, next) {
     if(account.customData.role==group.name){
       console.log("Hi>>>>>>>>>>>."+group)
     directory.createAccount(account, function (err,createdAccount) {
       console.log('yo------------'+createdAccount);
       createdAccount.addToGroup(group,function(err){
         if(err){
           return console.error(err);
         }
         console.log("account added to "+ group.name + "group")
       })
     });}



          next();   })

               });






     })
})



router.post('/hi', function(req, res) {
  if (!req.user.customData.billingTier || req.user.customData.billingTier.id !== 'pro') {
    res.status(402).json({ error: 'Please Upgrade to the pro plan' });
  } else {
    res.status(200).json({ hi: 'there' });
  }
});


module.exports = router;
