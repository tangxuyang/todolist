import Vue from 'vue';

//抽出todo列表业务逻辑类
export default class TodoList {
	constructor(url){		
		this.todolistUrl = url;
	}

	getTodoes(params){
		return Vue.request.get(this.todolistUrl,{params:params});
	}

	getTodo(id){
		return Vue.request.get(this.todolistUrl + '/' + id);
	}

	deleteTodo(id){		
		return Vue.request.delete(this.todolistUrl+'/'+id);
	}	

	addTodo(item){
		return Vue.request.post(this.todolistUrl,item);
	}

	modifyTodo(item){
		return Vue.request.put(this.todolistUrl,item);
	}
};