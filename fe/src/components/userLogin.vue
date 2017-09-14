<template>
	<el-dialog :close-on-click-modal="false" title="登录" :visible="visible">
		<el-form>
			<el-form-item label="用户名">
				<el-input v-model="userName"/>
			</el-form-item>
			<el-form-item label="密码">
				<el-input v-model="password"/>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">		    
		    <el-button type="primary" @click="login">确 定</el-button>
		</span>
	</el-dialog>
</template>
<script>
import apiUrls from '@/configs/apis';
let loginUrl = apiUrls.login['default'];

export default {
	name:"",
	data(){
		return {
			visible: false,
			userName:"",
			password:""
		};
	},
	methods:{
		login(){			
			this.$request.get(loginUrl,{
				params:{
					userName:this.userName,
					password:this.password
				}
			}).then(function(data){		
			 	console.log(data);

			});
		}
	}
}
</script>
<style>
	
</style>