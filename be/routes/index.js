var express = require('express');
var router = express.Router();
var config = require('../configs/configs');


var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = config.mongodb;


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

  console.log(regExpObj);  
  
  let query = Object.assign({userId:req.userInfo.id},req.query,regExpObj);
  delete query.pageSize;
  delete query.pageIndex;
  
  MongoClient.connect(url,function(err,db){

  	let tasks = db.collection('tasks').find(query);
  	let total = 0;
  	tasks.count(function(err,count){
  		total = count;
  		if(pageSize > 0){
  		tasks = tasks.skip(pageIndex*pageSize).limit(pageSize);
	  	}
	  	tasks.toArray(function(err,tasks){
	  		db.close();
	  		res.json({status:1,message:"success",data:{tasks:tasks,total:total,pageIndex:pageIndex,pageSize:pageSize}})  		
	  	});
  	});  	
  });

  // MongoClient.connect(url,function(err,db){//1.连接数据库
  // 	assert.equal(null,err);
  // 	console.log('Connected successfully to server');
  	

  // 	// db.collection('tasks').insertMany([{//2.插入多条数据
  // 	// 	id:1,
  // 	// 	title:"学习jQuery",
  // 	// 	content:"",
  // 	// 	status:"未开始",
  // 	// 	remark:""
  // 	// },{
  // 	// 	id:2,
  // 	// 	title:"学习React",
  // 	// 	content:"",
  // 	// 	status:"未开始",
  // 	// 	remark:""
  // 	// }]).then(function(result){
  // 	// 	console.log('插入成功！！');
  // 	// });


  // 	//3.查询数据库
  // 	var tasks = db.collection('tasks');
  // 	tasks.find({id:1}).toArray(function(err,docs){
  // 		assert.equal(err,null);
  // 		console.log("Found the following records")
  // 		console.log(docs);
  // 	});

  // 	//4.更新
  // 	tasks.updateOne({id:1},{$set:{title:"学习jQuery2"}},function(err,result){
  // 		assert.equal(err,null);
  // 		assert.equal(1,result.result.n);
  // 		console.log('Updated the document with the field id equal to 2');  		
  // 	});

  // 	//5.删除
  // 	tasks.deleteOne({id:1},function(err,result){
  // 		assert.equal(err,null);
  // 		assert.euqal(1,result.result.n);
  // 		console.log('Removed the document with the field id equal to 1');  		
  // 	})
  // 	db.close();//x.关闭数据库

  // 	res.render('index', { title: 'Express' });
  // });  
});

//查询单条数据
router.get('/:id',function(req,res,next){
	//console.log("id:",req.params.id);
	let id = new MongoClient.connect.ObjectID(req.params.id);
	MongoClient.connect(url,function(err,db){
		//console.log(MongoClient.connect.ObjectID);
		db.collection('tasks').findOne({_id:id,userId:req.userInfo.id}).then(function(task){

			//console.log(task);

			db.close();
			res.json({status:1,message:"success",data:task});			
		}).catch(function(){
			res.json({status:0,message:"fail"})
			db.close();
		});
	});
	//res.render('index', { title: 'Express' });
});

//新增数据
router.post('/',function(req,res,next){
	//console.log(req.body);
	//console.log(req.form);
	//console.log(req.params);
	//console.log(req.query);
	let data = req.body;
	data.userId = req.userInfo.id;
	delete data._id;
	MongoClient.connect(url,function(err,db){//1.连接数据库

	//todo:检查请求的data


	//2.查找相同title
	db.collection('tasks').findOne({title:data.title,userId:req.userInfo.id},{_id:0}).then(function(result){
		if(!!result){			
			res.json({status:0,message:data.title+" 已经存在了！"});
			db.close();
		}else{
			//3.原样插入不做任何处理	
		  	db.collection('tasks').insertOne(data).then(function(result){
		  		res.json({status:1,message:"success"});
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

//更新数据
router.put('/',function(req,res,next){
	//console.log(req.body);
	let data = req.body;
	let id = new MongoClient.connect.ObjectID(data._id);
	delete data._id;
	MongoClient.connect(url,function(err,db){//1.连接数据库
		db.collection('tasks').updateOne({_id:id,userId:req.userInfo.id},data).then(function(){
			db.close();
			res.json({status:1,message:"success"});			
		}).catch(function(){
			db.close();
			res.json({status:0,message:"fail"});			
		});
	});	
});

//删除数据
router.delete('/:id',function(req,res,next){
	let id = new MongoClient.connect.ObjectID(req.params.id);
	MongoClient.connect(url,function(err,db){
		db.collection('tasks').remove({_id:id,userId:req.userInfo.id}).then(function(){
			db.close();
			res.json({status:1,message:"success"});
		}).catch(function(){
			db.close();
		});
	});
});

module.exports = router;
