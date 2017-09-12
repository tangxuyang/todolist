var express = require('express');
var router = express.Router();


var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27018/todolist';
//var url = 'mongodb://localhost:27017/todolist';

/* GET users listing. */
router.get('/', function(req, res, next) {
	  	MongoClient.connect(url,function(err,db){

		  	let tasks = db.collection('tasks').distinct('tags',function(err,tags){

		  		db.close();
		  		res.json({status:1,message:"success",data:tags});
		  	});		  	
		 });
});

module.exports = router;
