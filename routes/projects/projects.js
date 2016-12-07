var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/',function(req,res,next){
	//console.log(req.user.groups.href)
	individual_group_href="https://api.stormpath.com/v1/groups/5XQApHcYAzYyY4ZxeNW13A"
	//if(individual_group_href==req.user.group)
	var client=req.app.get('stormpathClient')
	var href = req.user.href
	var count=0;
	var user_projects=[];
	var project_users=[];
	var allusers=[];
	var dir_href=req.user.directory.href
	console.log(dir_href)
 //getting directory to get groups specific to organisation
 console.log(req.user)
	client.getDirectory(dir_href,function (err, directory) {
  //console.log(directory);
	//through directory every group present are returned
		directory.getGroups(function(err, groupsCollection) {
	//groups collection is iterated to print each group and its href
  			groupsCollection.each(function(group, next) {
				if(group.name!='user' && group.name!='admin'){
		//console.log('^^^^^^^^^^^^^^')
    				//console.log(group.name);
		//console.log(group.href)
		 			user_projects.push({project_name:group.name,project_href:group.href});
		//console.log('^^^^^^^^^^^^^^^^^^^^^^^^^')
				}
    		//next();
			})
			count++;
			//ex_end();
  		});

	});


//this flow is to get account to get groups its related to
	client.getAccount(href, function (err, account) {
	//then its associated groups are returned
  		account.getGroups(function(err,collection){
  			var users=[];
			if (!err) {
    			collection.each(function(group, next){
			//accounts present in each group are iteratively returned except admin and user groups (we need only project groups)
					if(group.name!='user' && group.name!='admin'){
			//	console.log(group.name+"--------------------------")
			//	console.log(group.href+"--------------------------------")
						group.getAccounts(function (err, collection) {
	 	      				collection.each(function (account, next) {
     //console.log('Found account for ' + account.givenName + ' (' + account.email + ')');
		 //console.log('*******************')

		 						users.push(account);
          						next();
  							});
       						project_users.push({project_name:group.name,project_href:group.href,users:users})

						});
					}
				//	next();
				});
				count++;
       			//ex_end();
  			}

	//this flow is to get all accounts in the organisation i.e directory
			var href_dir=req.user.directory.href
			client.getDirectory(href_dir,function(err,directory){
				directory.getAccounts(function(err, collection) {
			//console.log('Getting all Accounts')
			//console.log(collection)
	  				collection.each(function(account, next) {
	    //console.log('Found account for ' + account.givenName + ' (' + account.email + ')');
				    	allusers.push(account.givenName);
	    	//			next();
	  				});
	  				count++;
	  				//ex_end();
				});

			})
		})
	});

 setTimeout(function(){
		//if(count==3){
				console.log("-----------------------------------------------------");
				console.log(user_projects);
				console.log("------------------------------------------------------");
				console.log(project_users);
				console.log("------------------------------------------------------");
				console.log(allusers);
				console.log("------------------------------------------------------");
				res.render('project.ejs',{userProjects:user_projects,project_users:project_users,allusers:allusers});
		//	}

	}, 3000);

	// var ex_end=function(){
	// 	//if(count==3){
	// 			console.log("-----------------------------------------------------");
	// 			console.log(user_projects);
	// 			console.log("------------------------------------------------------");
	// 			console.log(project_access);
	// 			console.log("------------------------------------------------------");
	// 			console.log(allusers);
	// 			console.log("------------------------------------------------------");
	// 			res.render('project.ejs')
	// 	//	}

	// }

//send list of users in the user group,existing users

})



router.get('/add_project',function(req,res,next){
	//this flow is for project group creation
newGroup={
 //name:req.body.projectName
	//description:req.body.projectDesc
	name:'created_project_7',
	description:'created_project_description_7'
}
var app_href = 'https://api.stormpath.com/v1/applications/1xLxnUnZSfnFMesw7whSnZ';
var client=req.app.get('stormpathClient')
  var href=req.user.directory.href
	//directory is called to create group specific to organisation
	client.getDirectory(href,function(err,directory){
		console.log(directory)
		directory.createGroup(newGroup,function(err,group){
			console.log(group.name)
			console.log(req.user)
			group.getCustomData(function(err,customData) {
				customData.createdBy=req.user.email
				customData.save(function(err){
					if(!err){
						console.log('Custom Data of Group is Saved')
					}
				})
			})
      client.getAccount(req.user.href,function(err,accessToken){
				accessToken.addToGroup(group.href,function(err,GroupMembership){
					if(err){
						console.log('error to add')
					}
					else {
						console.log(GroupMembership)
					}
				})
			})

			var groupStoreMapping={
				accountStore:{
					href:group.href
				}
			}
//though group is created ,it should be mapped to the application
     client.getApplication(app_href,function(err,application){
			 console.log(group)
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


})

router.get('/fake_route_individual',function(req,res,next){
	var client=req.app.get('stormpathClient')
	var href = req.user.href
	var count=0;
	var user_projects=[];
	var project_users=[];
	var allusers=[];
	var dir_href=req.user.directory.href



})


router.get('/add_users',function(req,res,next){
//req.body.projectName
//req.body.projectHref
//var href_dir=req.user.directory.href

var client=req.app.get('stormpathClient')
//to add user group is obtained
client.getGroup(projectHref,function(err,group){
	var group_href=group.href
	for(account in req.body.user){
		var href = account.href
		var name=account.userName
		//users are iterated to add to the group i.e project obtained
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

router.get('/delete_users',function(req,res,next){
	//delHref=req.body.delete_href
	var client=req.app.get('stormpathClient')
	//similar to add user function
	client.getGroup(delHref, function (err, group) {
	  console.log(group);
		group.delete(function(err){
			if(!err){
				console.log('Successfully Removed')
			}
			else {
				console.log('Failed to Delete')
			}

		})
	});
})

module.exports = router;
