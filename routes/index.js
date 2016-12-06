var express = require('express');
var router = express.Router();
var stormpath=require('express-stormpath');
var stripe=require('stripe')("sk_test_g3WF6wdXVLB5GHA2bAgmW3RU");



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs');
});






router.get('/payment',function(req,res,next){
  res.render('payment.ejs')
})
router.post('/payment', function(req, res, next) {
    console.log("check-1")
    var client = req.app.get('stormpathClient');
    stripe.customers.create({
        source: req.body.stripeToken,
        plan: 'pro',
        email:req.body.email
          }, function(err, customer) {
        if (err) return next(err);
        req.somevariable=customer.id
        res.redirect('/signup_2/?valid=' + customer.id);

          });

          });

router.get('/signup_2',function(req,res,next){
  console.log(req.query.valid)
  res.render('signup_2.ejs',{
    stripe_tran_id:req.query.valid
  })
})

router.post('/signup_2',function(req,res,next){
//  var nameValue = document.getElementById("63211428158149").value;
console.log(req.somevariable)
  console.log(req.body.q36_organisation)
var client = req.app.get('stormpathClient');
  var newOrganization = {
  name: req.body.q36_organisation,
  nameKey: req.body.q39_organisationDescription
};

  client.createOrganization(newOrganization, function (err, organization) {
    if (err) {
      return console.log(err);
    }

    console.log(organization);

     var directoryData = {
   name: req.body.q37_directory,
   description: req.body.q38_directoryDescription
 };

 client.createDirectory(directoryData, function (err, directory) {
   if (err) {
     return console.error(err);
   }

   console.log('Created directory %s!', directory.href);
  //var directoryHref=directory.href

 var accountStoreMapping = {
  accountStore: {
   href:directory.href
  },
  isDefaultAccountStore: true,
  isDefaultGroupStore: true
};

organization.createAccountStoreMapping(accountStoreMapping, function (err) {
  if (err) {
    return console.error(err);
  }

  console.log('Directory is mapped!');


var accountData = {
  givenName: req.body.q1_firstName,
  surname: req.body.q17_lastName,
  username: req.body.q1_firstName,
  email: req.body.q35_email,
  password: 'Vatvatvat1',
  customData:{stripeID:'rtyereees',
  role:1}
};
organization.createAccount(accountData, function (err, account) {
if (err) {
return console.error(err);
}
console.log('----------\n', account);
req.session.user = account;
console.log('----------\n');

/*organization.setDefaultGroupStore(directory.href, function (err) {
  if (!err) {
    console.log('Directory was set as default group store');
  }
}); */

var href = 'https://api.stormpath.com/v1/applications/1xLxnUnZSfnFMesw7whSnZ';

client.getApplication(href, function (err, application) {
  console.log(application);
var group = {
  name: 'admin',
  description:'User with High Privileges'
};

organization.createGroup(group, function (err, group) {
  if (!err) {
    console.log('Group Created!');
  }

  var href=group.href

  account.addToGroup(group, function(err){
    if(err){
      return console.error(err);
    }

    console.log("Added to group")
    var groupStoreMapping = {
     accountStore: {
      href:group.href
     }
    // isDefaultAccountStore: true,
    // isDefaultGroupStore: true
    };

    application.createAccountStoreMapping(groupStoreMapping, function (err) {
     if (err) {
       return console.error(err);
     }

     console.log('group  is mapped!');

   })

 })
  });


});//groups
});//accountCreation

});//accountMapping
});//createDirectory
res.redirect('/')
});//createOrganisation



})

module.exports = router;
