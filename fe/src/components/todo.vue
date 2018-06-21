<template>
<div style="max-width: 500px; margin: 30px auto;">
    <h2>{{item.title}}</h2>    
    <div>标签：
        <el-tag size="mini" :color="tagColors[index]" v-for="(tag, index) in item.tags">
            {{tag}}
        </el-tag>
    </div>
    <p>状态：{{item.status}}</p>
    <div v-html="item.desc">    
    </div>
    <div v-html="item.remark">
    </div>
</div>
</template>
<script>
import apiUrls from '@/configs/apis';
let todolistUrl = apiUrls.todolist['default'];
import Todo from '@/models/Todo';
import TodoList from '@/models/TodoList';
export default {
    name: "todo",
    data() {
        return {
            item: {},
            tagColors:['#aaa','#3c3c3c','#ccc','#cc3388'],
        };
    },
    created() {
        this.todoList = new TodoList(todolistUrl);
        console.log('query', this.$route.params);
        this.todoList.getTodo(this.$route.params.id).then((data)=>{
            this.item = data.data;
        });
    }    
}
</script>
<style>

</style>


