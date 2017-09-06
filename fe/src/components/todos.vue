<template>
	<div>
		<el-button type="primary" @click="addItem">add</el-button>
		<el-table :data="items">
			<el-table-column 
				type="index"
			>
			</el-table-column>
			<el-table-column
				prop="title"
				label="title"
			></el-table-column>
			<el-table-column
				prop="desc"
				label="desc"
			>
			</el-table-column>
			<el-table-column
				prop="status"
				label="status"
			>
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button
						size="small"
						type="primary"
						@click="modifyItem(scope.row)">
						编辑
					</el-button>
					<el-button
						size="small"
						type="danger"
						@click="deleteItem(scope.row)">
						删除
					</el-button>
					<!-- <el-button
						size="small"
						type="warning"
						@click="ModifyItemStatus(scope.row)">
						修改状态
					</el-button> -->
				</template>
			</el-table-column>
		</el-table>	


		<el-dialog
			title="新增"
			:visible.sync="addDialogVisible"
			size="tiny">
			<el-form :model="item" label-width="80px">
				<el-form-item label="title">
					<el-input v-model="item.title"></el-input>
				</el-form-item>
				<el-form-item label="desc">
					<el-input v-model="item.desc"></el-input>
				</el-form-item>		
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="addDialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="addItemConfirm">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog
			title="新增"
			:visible.sync="modifyDialogVisible"
			size="tiny">
			<el-form :model="item" label-width="80px">
				<el-form-item label="title">
					<el-input v-model="item.title"></el-input>
				</el-form-item>
				<el-form-item label="desc">
					<el-input v-model="item.desc"></el-input>
				</el-form-item>		
				<el-form-item label="status">
					<el-input v-model="item.status"></el-input>
				</el-form-item>	
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="modifyDialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="modifyItemConfirm">确 定</el-button>
			</span>
		</el-dialog>	
	</div>
</template>
<script>
import apiUrls from '@/configs/apis';
let todolistUrl = apiUrls.todolist['default'];

export default {
	name:"todos",
	data(){
		return {
			addDialogVisible:false,
			modifyDialogVisible:false,
			item:{
				_id:"",
				title:"",
				desc:"",
				status:""
			},
			items:[]
		};
	},
	mounted(){
		 this.refresh();
	},
	methods:{
		refresh(){
			let self = this;
		
			 this.$request.get(todolistUrl).then(function(data){		
			 	self.items = data.data;
			 });
		},
		addItem(){
			this.item = {
				_id:"",
				title:"",
				desc:"",
				status:""
			}
			this.addDialogVisible = true;
		},
		addItemConfirm(){
			this.item.status="没开始";
			let self = this;
			this.$request.post(todolistUrl,this.item).then(function(data){
				if(data.status == 1){
					self.$message('添加成功！');
					self.addDialogVisible = false;
					self.refresh();
				}
				else{
					self.$message('失败');
				}
			});
		},
		modifyItem(item){
			this.item = Object.assign({},item);
			this.modifyDialogVisible = true;
		},
		modifyItemConfirm(){			
			let self = this;
			this.$request.put(todolistUrl,this.item).then(function(data){
				if(data.status == 1){
					self.$message('修改成功！');
					self.modifyDialogVisible = false;
					self.refresh();
				}else{

				}				
			});
		},
		modifyItemStatus(item){
			this.item = Object.assign({},item);
		},
		modifyItemStatusConfirm(){

		},
		deleteItem(item){
			let self = this;
			this.item = item;
			this.$confirm('确认删除?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          this.$request.delete(todolistUrl+item._id).then(function(data){
	          	if(data.status == 1){
	          		self.$message({
		              type: 'success',
		              message: '删除成功!'
		            });

		            self.refresh();
	          	}
	          });	          
	        });
		}
	}
}
</script>

<style>

</style>