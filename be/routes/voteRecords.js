var express = require('express');
var router = express.Router();
var config = require('../configs/configs');


var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = config.mongodb;
var auth = require('../middlewares/authentication');


/* GET home page. */
router.get('/', function(req, res, next) {

  let pageIndex = +(req.query.pageIndex || 0);
  let pageSize = +(req.query.pageSize || 10);
  let regExpObj = {};
  if(req.query){ // 抽出$like
	  for(let key in req.query){
		  if(req.query[key]['$like']){
			  regExpObj[key] = new RegExp(req.query[key]['$like'],'i');
			  delete req.query[key];
		  }
	  }
  }  
  
  let query = Object.assign({},req.query,regExpObj);
  delete query.pageSize;
  delete query.pageIndex;
  
  MongoClient.connect(url,function(err,db){

  	let voteRecords = db.collection('voteRecords').find(query);
  	let total = 0;
  	voteRecords.count(function(err,count){
  		total = count;
  		if(pageSize > 0){
            voteRecords = voteRecords.skip(pageIndex*pageSize).limit(pageSize);
	  	}
	  	voteRecords.toArray(function(err,voteRecords){
	  		db.close();
	  		res.json({status:1,message:"success",data:{voteRecords: voteRecords,total:total,pageIndex:pageIndex,pageSize:pageSize}})  		
	  	});
  	});  	
  }); 
});

//查询单条数据
router.get('/:id',function(req,res,next){
	let id = new MongoClient.connect.ObjectID(req.params.id);
	MongoClient.connect(url,function(err,db){
		db.collection('voteRecords').findOne({_id:id}).then(function(v){
			db.close();
			res.json({status:1,message:"success",data:v});			
		}).catch(function(){
			res.json({status:0,message:"fail"})
			db.close();
		});
	});
});

//新增数据
router.post('/', function(req,res,next){
	let data = req.body;
	data.userId = req.userInfo.id;
	delete data._id;
	MongoClient.connect(url,function(err,db){//1.连接数据库
	//2.查找相同title
	db.collection('voteRecords').findOne({voteId: data.voteId, name: data.name},{_id:0}).then(function(result){
        if(!!result){// 已经投过票了，更新原来的投票
            db.collection('votes').updateOne({_id: result._id },data).then(()=>{
                res.json({status:1 ,message: "success"});
                db.close();
            }).catch(()=>{
                db.close();
                res.json({status:0,message:"fail"});	
            });
		}else{
			data.createTime = Date.now();
			//3.原样插入不做任何处理	
		  	db.collection('voteRecords').insertOne(data).then(function(result){
		  		res.json({status:1,message:"success"});
		  		db.close();
		  	}).catch(function(){
                  db.close();
                  res.json({status:0,message:"fail"});	
		  	}); 
		}
	}).catch(function(){
        db.close();
        res.json({status:0,message:"fail"});	
	});
  });
});

//更新数据
router.put('/', function(req,res,next){
	let data = req.body;
	let id = new MongoClient.connect.ObjectID(data._id);
	delete data._id;
	data.updateTime = Date.now();
	MongoClient.connect(url,function(err,db){//1.连接数据库
		db.collection('votes').updateOne({_id:id},data).then(function(){
			db.close();
			res.json({status:1,message:"success"});			
		}).catch(function(){
			db.close();
			res.json({status:0,message:"fail"});			
		});
	});	
});

//删除数据
router.delete('/:id', auth, function(req,res,next){
	let id = new MongoClient.connect.ObjectID(req.params.id);
	MongoClient.connect(url,function(err,db){
		db.collection('voteRecords').remove({_id:id}).then(function(){
			db.close();
			res.json({status:1,message:"success"});
		}).catch(function(){
			db.close();
		});
	});
});

module.exports = router;
