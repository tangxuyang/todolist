var express = require('express');
var router = express.Router();
var config = require('../configs/configs');

var MongoClient = require('mongodb').MongoClient;

var url = config.mongodb;

/* GET users listing. */
router.get('/', function(req, res, next) {
  	MongoClient.connect(url,function(err,db){

	 db.collection('tasks').distinct('tags',{userId:req.userInfo.id},function(err,tags){
	  		db.close();
	  		res.json({status:1,message:"success",data:tags});
	  	});		  	
	 });
});

module.exports = router;
