var express = require('express');
var router = express.Router();

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



module.exports = router;
