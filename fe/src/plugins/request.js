export default {
	install(Vue){

		Vue.request = Vue.prototype.$request = {};
		let methods = ['get','head','delete','jsonp','post','put','patch'];

		methods.forEach(function(method){
			Vue.request[method] = function(){
				let _arguments = arguments;				
				return new Promise(function(resolve,reject){
					Vue.http[method].apply(Vue.http,_arguments).then(function(res){
						resolve(res.body,res);
					},function(res){
						reject(res);
					})
				});
			}
		});

		Vue.http.interceptors.push(function(req,next){
			let token = window.localStorage['token'] || 'token'; 
			req.headers.set('token',token);

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