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

router.get('/create_user',stormpath.loginRequired,function(req,res,next){
  res.render("create_user.ejs")
})



router.post('/create_user',stormpath.groupsRequired(['admin']),function(req,res,next){
//console.log('User:',req.user,'jsut accessed the /create user');
  var client = req.app.get('stormpathClient');
  //console.log(req.user.directory)
  var href_dir=req.user.directory.href

console.log(account)
client.getDirectory(href_dir,function(err,directory){
  directory.createAccount({
    givenName: req.body.firstName,
    surname: req.body.lastName,
    username: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  }, function (err, createdAccount) {
    console.log(err);
    directory.getGroups(function(err,groupsCollection){
      groupsCollection.each(function(group,next){
     if(req.body.role==group.name){
       createdAccount.addToGroup(group,function(err){
         console.log("account added to"+group.name+' group')
       })
     }

      })
    })

});
})


})

router.get('/remove_user',function(req,res){

remove_user_list=['https://api.stormpath.com/v1/accounts/1AU80rErxTb7aMnhpQdcTe']
  var client = req.app.get('stormpathClient');
  var href_group='https://api.stormpath.com/v1/groups/5IMtsRrMLTOs4RqIZ080ye'
  client.getGroup(href_group,function(err,group)
    {
    //  console.log(group)
      for (i=0;i<remove_user_list.length; i++){
    //    console.log(remove_user_list[i])
      client.getAccount(remove_user_list[i],function (err, account) {
    //    console.log(account)
      account.getGroupMemberships(function(err,CollectionResource){
       CollectionResource.each(function(membership,next){
         console.log(membership)
         if(membership.group.href==href_group){
           membership.delete(function(err){
             if(err){
               console.log(err)
             } else{
               console.log(account.email +' account got removed from '+ group.name)
             }
           })
         }
       })

      /*  CollectionResource.delete(function(err){
          if(err){
            console.log(err)
          } else {
            console.log('Resource deleted')
          }
        }) */

      })

    //console.log('Found account for ' + account.givenName + ' (' + account.email + ')');

  });
}
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
