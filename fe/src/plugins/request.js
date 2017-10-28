

export default {
	install(Vue){

		Vue.request = Vue.prototype.$request = {};
		let methods = ['get','head','delete','jsonp','post','put','patch'];

		function updateToken(res){
			let token = res && res.headers && res.headers.get('token');			
			window.localStorage.token = token;
		}

		methods.forEach(function(method){
			Vue.request[method] = function(){
				let _arguments = arguments;				

				return new Vue.Promise(function(resolve,reject){
					Vue.http[method].apply(Vue.http,_arguments).then(function(res){									
						updateToken(res);
						if(res.body.status == 1){//成功
							resolve(res.body,res);
						}else if(res.body.status == 1100){//未登录
							window.vueRoot && window.vueRoot.$children[0].login(function(){
								Vue.request[method].apply(Vue,_arguments).then(resolve).catch(reject);//重试之前的请求
							});
							//reject(res);							
						}else{//失败
							reject(res);
						}
					},function(res){
						updateToken(res);						
						reject(res);
					});
				});
			}
		});

		Vue.http.interceptors.push(function(req,next){
			let token = window.localStorage['token'] || ''; 
			req.headers.set('token',token);
			req.headers.set('X-Requested-With','XMLHttpRequest');//为了让express中的res.xhr能认出这是ajax请求！
			next();
		});
		/*
		taken from vue-resource document
		get(url, [options])
		head(url, [options])
		delete(url, [options])
		jsonp(url, [options])
		post(url, [body], [options])
		put(url, [body], [options])
		patch(url, [body], [options])
		*/
	}
};