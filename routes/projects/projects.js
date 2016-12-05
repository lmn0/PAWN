var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/',function(req,res,next){
	console.log(req.user.groups.href)
	var client=req.app.get('stormpathClient')
	var href = req.user.href
 var dir_href=req.user.directory.href
	client.getDirectory(dir_href,function (err, directory) {
  console.log(directory);
	directory.getGroups(function(err, groupsCollection) {
  groupsCollection.each(function(group, next) {
		console.log('^^^^^^^^^^^^^^')
    console.log(group.name);
		console.log(group.href)
		console.log('^^^^^^^^^^^^^^^^^^^^^^^^^')
    next();
	})
  });

});

client.getAccount(href, function (err, account) {
  account.getGroups(function(err,collection){
		if (!err) {
    collection.each(function(group, next){
			if(group.name!='user'||group.name!='admin'){
			//	console.log(group.name+"--------------------------")
			//	console.log(group.href+"--------------------------------")
				group.getAccounts(function (err, collection) {
       collection.each(function (account, next) {
     console.log('Found account for ' + account.givenName + ' (' + account.email + ')');
		 console.log('*******************')
          next();
  });
});
			}

		});
  }
	var href_dir=req.user.directory.href
	client.getDirectory(href_dir,function(err,directory){
		directory.getAccounts(function(err, collection) {
			console.log('Getting all Accounts')
			console.log(collection)
	  collection.each(function(account, next) {
	    console.log('Found account for ' + account.givenName + ' (' + account.email + ')');
	    next();
	  });
	});
	})
	})
});

var href_dir=req.user.directory.href
client.getDirectory(href_dir,function(err,directory){
	directory.getAccounts(function(err, collection) {
		console.log('Getting all Accounts')
		console.log(collection)
  collection.each(function(account, next) {
    console.log('Found account for ' + account.givenName + ' (' + account.email + ')');
		console.log('user and href should be sent')
    next();
  });
});
})


//send list of users in the user group,existing users
	res.render('project.ejs')
})



router.get('/add_project',function(req,res,next){
newGroup={
 //name:req.body.projectName
	//description:req.body.projectDesc
	name:'created_project_2',
	description:'created_project_description_2'
}
var app_href = 'https://api.stormpath.com/v1/applications/5XOc1tMvhE3zTs4hHH0BFb';
var client=req.app.get('stormpathClient')
  var href=req.user.directory.href
	client.getDirectory(href,function(err,directory){
		console.log(directory)
		directory.createGroup(newGroup,function(err,group){
			console.log(group.name)
			var groupStoreMapping={
				accountStore:{
					href:group.href
				}
			}
     client.getApplication(app_href,function(err,application){
			 console.log(application.name)
			 application.createAccountStoreMapping(groupStoreMapping, function (err) {
			  if (err) {
			    return console.error(err);
			  }

			  console.log('Project  is mapped!');

			 })
		 })

		})
	})


res.redirect('/')

	//if userr is admin ,also have an object list o users
	 //check who user is ,if so map project to lkst of users given else map to logged in
})


router.get('/add_users',function(req,res,next){
//req.body.projectName
//req.body.projectHref
//var href_dir=req.user.directory.href

var client=req.app.get('stormpathClient')

client.getGroup(projectHref,function(err,group){
	var group_href=group.href
	for(account in req.body.user){
		var href = account.href
		var name=account.userName
client.getAccount(href, function (err, account) {
  console.log(account.name);
	account.addToGroup(group,function(err){
		if(err){
			return console.error(err)
		}
		console.log('added to'+group.name)
	})
});

	}
})

})

module.exports = router;
