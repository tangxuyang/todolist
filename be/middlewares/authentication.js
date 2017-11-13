/*
	认证中间件，判断用户是否登录

	读取headers中指定header的内容，解密

	dependencies：加密/解密

	userid|todolist|time
*/

let headerName = 'token';
let timeout = 30*60*1000;//毫秒

let crypto = require('crypto');
let password = 'txy-zqc';
let middle = 'todolist';

function handleUnauthenticated(req,res){
	if(req.xhr){
		res.json({status:1100,message:"未登录！"});
	}else{
		res.send("未登录！");
	}
}

module.exports = function(req,res,next){

	let header = req.get(headerName);	
	if(!header){//未登录
		handleUnauthenticated(req,res);
		return;
	}

	try{
		let decipher = crypto.createDecipher('aes192',password);

		let decrypted = decipher.update(header,'base64','utf8');

		decrypted += decipher.final('utf8');		
		let strs = decrypted.split('|');
		if(strs.length != 3 || strs[1] != middle){
			handleUnauthenticated(req,res);
			return;
		}

		let lastTime = new Date(parseInt(strs[2]));
		let now = new Date();
		console.log(now-lastTime);
		if(now-lastTime>timeout){//超时
			handleUnauthenticated(req,res);
			return;
		}

		strs[2] = now.getTime();

		let clearText = strs.join('|');
		let cipher = crypto.createCipher('aes192',password);
		let encrypted = cipher.update(clearText,'utf8','base64');
		encrypted += cipher.final('base64');
		req.userInfo = {
			id: strs[0]
		};
		res.set(headerName,encrypted);
		next();
	}catch(ex){		
		handleUnauthenticated(req,res);
	}	
};