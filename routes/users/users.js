var express = require('express');
var router = express.Router();
var stormpath=require('express-stormpath');
/* GET users listing. */
router.get('/',function(req,res,next){
	var client=req.app.get('stormpathClient')
	//console.log(req.user)
	console.log(req.user)
	res.render('user.ejs',{
		userName:req.user.username,
		 email:req.user.email,
		 firstName:req.user.givenName,
		lastName:req.user.surname,
		stripeID:req.user.customData.stripeID,
		city:req.user.customData.city,
	  country:req.user.customData.country,
		postal:req.user.customData.postal,
		address:req.user.customData.address

	})
})

router.post('/data',function(req,res,next){
	var client = req.app.get('stormpathClient');
   //console.log(req.body)
	 var href=req.user.href
	 req.user.userName=req.body.userName
	 req.user.email=req.body.email
	 req.user.firstName=req.body.firstName
	 req.user.lastName=req.body.lastName
	 req.user.customData.address=req.body.address
	 req.user.customData.city=req.body.city
	 req.user.customData.country=req.body.country
	 req.user.customData.postal=req.body.postal
	 console.log(req.body)
	 req.user.save(function (err) {
  if (err) {
    res.status(400).end('Oops!  There was an error: ' + err.userMessage);
  }
	req.user.customData.save(function (err) {
 if (err) {
	 res.status(400).end('Oops!  There was an error: ' + err.userMessage);
 }
 redirect('/users')
 next()
});

/*  client.getAccount(href,function(err,account){
		console.log(req.body);
		account.getCustomData(function(err, customData){
  customData.save(function(err){
    if(!err) {
      console.log('Everything  is  updated');
    }
  });
});
	}) */
})
})

router.get('/log-me-out',function(req,res,next){
  res.render('logout.ejs');
})


router.get('/create_user',function(req,res,next){
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
		customData:{
			role:req.body.role
		}
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


module.exports = router;
