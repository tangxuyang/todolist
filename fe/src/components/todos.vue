<template>
	<div>
		<el-button type="primary" @click="addItem">add</el-button>
		<el-button type="primary" @click="setQuery">setQuery</el-button>
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
				prop="remark"
				label="remark"
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
		
		<el-pagination      
      @current-change="handleCurrentChange"      
      :page-size="pageSize"
      :current-page.sync="pageIndex"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
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
			title="编辑"
			:visible.sync="modifyDialogVisible"
			size="tiny">
			<el-form :model="item" label-width="80px">
				<el-form-item label="title">
					<el-input v-model="item.title"></el-input>
				</el-form-item>
				<el-form-item label="desc">
					<el-input v-model="item.desc"></el-input>
				</el-form-item>	
				<el-form-item label="remark">
					<el-input v-model="item.remark"></el-input>
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
		<el-dialog
			title="设置查询条件"
			:visible.sync="queryDialogVisible"
			size="tiny"
		>
			<el-button type="primary" @click="addQuery">+</el-button>
			<el-table :data="query">
				<el-table-column
				label="field"
				>
					<template scope="scope">
						<el-input v-model="scope.row.field"></el-input>
					</template>
				</el-table-column>
				<el-table-column
					label="value"
				>
					<template scope="scope">
						<el-input v-model="scope.row.value"></el-input>
					</template>
				</el-table-column>
				<el-table-column					
					label="操作"
				>
					<template scope="scope">
						<el-button type="danger" size="small" @click="removeQuery(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">			    
			    <el-button type="primary" @click="handleSetQuery">确 定</el-button>
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
		let query = JSON.parse(localStorage.query || "[]");
		return {
			addDialogVisible:false,
			modifyDialogVisible:false,
			queryDialogVisible:false,
			item:{
				_id:"",
				title:"",
				desc:"",
				status:"",
				remark:""
			},
			items:[],
			total:0,
			pageSize:10,
			pageIndex:1,
			query: query
		};
	},
	mounted(){
		 this.refresh();
	},
	methods:{
		refresh(pageIndex){
			let self = this;
			let tmpObj = {};
			if(this.query.length>0){
				this.query.forEach(function(q){
					tmpObj[q.field] = q.value;
				});
			}
			let params = Object.assign({},{pageIndex: self.pageIndex - 1},tmpObj);
			 this.$request.get(todolistUrl,{
			 	params:params
			 }).then(function(data){		
			 	self.items = data.data.tasks;
			 	self.total = data.data.total;
			 });
		},
		addItem(){
			this.item = {
				_id:"",
				title:"",
				desc:"",
				status:"",
				remark:"",
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
		},
		handleCurrentChange(){
			this.refresh();
		},
		setQuery(){
			this.queryDialogVisible = true;
		},
		addQuery(){
			this.query.push({field:"",value:""});
		},
		removeQuery(q){
			let index = this.query.indexOf(q);
			this.query.splice(index,1);
			//this.query.
		},
		handleSetQuery(){
			localStorage.query = JSON.stringify(this.query);
			this.refresh();
			this.queryDialogVisible=false
		}
	}
}
</script>

<style>

</style>