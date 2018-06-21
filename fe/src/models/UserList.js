import Vue from 'vue';

export default class UserList {
    constructor(url){		
		this.url = url;
	}

    addUser(item){
		return Vue.request.post(this.url, item);
	}
}