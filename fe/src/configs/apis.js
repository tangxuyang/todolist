let domain = "http://todolist.tangxuyang.cn/api";
//let domain = "http://localhost:8088"

export default {
	"todolist":{
		default:domain +"/todo"
	},
	"todo":{
		default:domain + "/todo"
	},
	"ueditor":{
		default:domain + "/ueditor"
	},
	"tag":{
		default:domain+"/tags"
	},
	"login":{
		default:domain+"/login"
	},
	"userList": {
		default: domain + "/users"
	}
};
