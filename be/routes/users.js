var express = require('express');
var router = express.Router();
var config = require('../configs/configs');


var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = config.mongodb;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a haha, just test for jenkins...');
});

//新增数据
router.post('/',function(req,res,next){
	let data = req.body;
	delete data._id;
	MongoClient.connect(url,function(err,db){//1.连接数据库

		//2.查找相同名字
		db.collection('users').findOne({userName: data.userName},{_id: 0}).then(function(result){
			if(!!result){			
				res.json({status: 0, message: data.userName+" 已经存在了！"});
				db.close();
			}else{
				//3.原样插入不做任何处理	
					db.collection('users').insertOne(data).then(function(result){
						res.json({status: 1, message: "success"});
						db.close();
					}).catch(function(){
						db.close();
					}); 
			}
		}).catch(function(){
			db.close();
		});
  });
});

module.exports = router;
