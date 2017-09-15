var express = require('express');
var router = express.Router();
var config = require('../configs/configs');

var MongoClient = require('mongodb').MongoClient;

var url = config.mongodb;

let crypto = require('crypto');
let password = 'txy-zqc';
let middle = 'todolist';
let headerName = 'token';

/* GET users listing. */
router.get('/', function(req, res, next) {
	var userName = req.query.userName;
	var pwd = req.query.password;
  	MongoClient.connect(url,function(err,db){

	  	db.collection('users').findOne({userName:userName,password:pwd},function(err,user){
	  		db.close();
	  		if(user){
	  			let cipher = crypto.createCipher('aes192',password);
	  			let clearText = user._id+"|"+middle+"|"+(new Date()).getTime();
	  			console.log('clearText:',clearText);
				let encrypted = cipher.update(clearText,'utf8','base64');
				encrypted += cipher.final('base64');
		  		res.set(headerName,encrypted);
		  		console.log('login-encrypted:',encrypted)
		  		res.json({status:1,message:"success",data:null});
	  		}else{
	  			res.json({status:0,message:"fail",data:null});
	  		}	  			  			  
	  	});		  	
	 });
});

module.exports = router;
