import Vue from 'vue';

//抽出vote列表业务逻辑类
export default class VoteList {
	constructor(url){		
		this.url = url;
	}

	getList(params){
		return Vue.request.get(this.url, {params:params});
	}

	getItem(id){
		return Vue.request.get(this.url + '/' + id);
	}

	deleteItem(id){		
		return Vue.request.delete(this.url+'/'+id);
	}	

	addItem(item){
		return Vue.request.post(this.url,item);
	}

	modifyItem(item){
		return Vue.request.put(this.url,item);
	}
};