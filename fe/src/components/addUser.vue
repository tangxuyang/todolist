<template>
    <el-form ref="form" :model="item" label-width="80px">
        <el-form-item label="用户名">
            <el-input v-model="item.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input type="password" v-model="item.password"></el-input>
        </el-form-item>        
        <el-form-item>
            <el-button type="primary" @click="onSubmit">创建</el-button>            
        </el-form-item>
    </el-form>
</template>
<script>
let url = apiUrls.userList['default'];
import UserList from '@/models/UserList';
import User from '@/models/User';
export default {
    name: "addUser",
    data() {
        return {
            item: new User()
        }
    },
    created() {
        this.userList = new UserList(url);
    },
    methods: {
        onSubmit() {
            this.userList.addItem(item).then(()=>{
                if(data.status == 1){
					this.$message('添加成功！');										
				}
				else{
					this.$message('失败');
				}
            });
        }
    }
}
</script>
<style>

</style>


