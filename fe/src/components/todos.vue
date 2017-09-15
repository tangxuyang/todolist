<template>
	<div>
		<el-button type="primary" @click="addItem">新增任务</el-button>
		<el-button type="warning" @click="setQuery">设置查询条件</el-button><br/><br/>
		<el-table :data="items">
			<el-table-column 
				type="index"
			>
			</el-table-column>
			<el-table-column
				prop="title"
				label="标题"
			></el-table-column>
			<el-table-column
				
				label="描述"
			>
				<template scope="scope">
					<div v-html="scope.row.desc">
					</div>
				</template>
			</el-table-column>
			<el-table-column
				label="标签"				
			>
				<template scope="scope">
					<el-tag size="mini" :color="tagColors[index]" v-for="(tag,index) in scope.row.tags">
						{{tag}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column
				pro
				label="备注"
			>
				<template scope="scope">
					<div v-html="scope.row.remark">
					</div>
				</template>
			</el-table-column>
			<el-table-column
				prop="status"
				label="状态"
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
				</template>
			</el-table-column>
		</el-table>	
		<br/>
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
			size="small">
			<el-form :model="item" label-width="80px">
				<el-form-item label="标题">
					<el-input v-model="item.title"></el-input>
				</el-form-item>
				<el-form-item label="描述">
					<UEditor id="add-desc" v-model="item.desc" :zindex="4000"></UEditor>
				</el-form-item>
				<el-form-item label="标签">
					<el-select
						v-model="item.tags"
					    filterable
					    allow-create
					    multiple					    
					    placeholder="请选择标签">
					    <el-option
					      v-for="tag in tags"
					      :key="tag"
					      :label="tag"
					      :value="tag">
					    </el-option>
					 </el-select>
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
			size="small">
			<el-form :model="item" label-width="80px">
				<el-form-item label="标题">
					<el-input v-model="item.title"></el-input>
				</el-form-item>
				<el-form-item label="标签">
					<el-select
						v-model="item.tags"
					    filterable
					    allow-create
					    multiple					    
					    placeholder="请选择标签">
					    <el-option
					      v-for="tag in tags"
					      :key="tag"
					      :label="tag"
					      :value="tag">
					    </el-option>
					 </el-select>
				</el-form-item>
				<el-form-item label="描述">
				
					<UEditor id="desc" v-model="item.desc" :zindex="4000"></UEditor>
				</el-form-item>	
				<el-form-item label="备注">
					
					<UEditor id="remark" v-model="item.remark" :zindex="4000"></UEditor>
				</el-form-item>	
				<el-form-item label="状态">
					<el-input v-model="item.status"></el-input>
				</el-form-item>	
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="modifyDialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="modifyItemConfirm">确 定</el-button>
			</span>					
		</el-dialog>			
		<!-- <el-dialog
			title="设置查询条件"
			:visible.sync="queryDialogVisible"
			size="small"
		>
			<el-button type="primary" size="small" @click="addQuery">新增查询条件</el-button><br/><br/>
			<el-table :data="query">
				<el-table-column
				label="字段"
				>
					<template scope="scope">
						<el-input v-model="scope.row.field"></el-input>
					</template>
				</el-table-column>
				<el-table-column 
				label="操作符"
				>
					<template scope="scope">
						<el-select v-model="scope.row.operator" placeholder="请选择">
						    <el-option
						      v-for="item in ['=','!=']"
						      :key="item"
						      :label="item"
						      :value="item">
						    </el-option>
						  </el-select>
					</template>
				</el-table-column>
				<el-table-column
					label="值"
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
		</el-dialog> -->
		<QueryDialog ref="qd" @queryChanged="queryChanged" />
	</div>
</template>
<script>
import apiUrls from '@/configs/apis';
let todolistUrl = apiUrls.todolist['default'];
let tagUrl = apiUrls.tag['default'];

import UEditor from '@/components/UEditor';
import QueryDialog from '@/components/queryDialog';

export default {
	name:"todos",
	components:{
		UEditor: UEditor,
		QueryDialog: QueryDialog
	},
	data(){		
		return {
			addDialogVisible:false,
			modifyDialogVisible:false,			
			item:{
				_id:"",
				title:"",
				desc:"",
				status:"",
				remark:"",
				tags:[]
			},
			items:[],
			total:0,
			pageSize:10,
			pageIndex:1,
			query: [],
			tags:[],
			values:[],
			tagColors:['#aaa','#3c3c3c','#ccc','#cc3388']
		};
	},
	mounted(){
		 this.query = this.$refs.qd.getQuery();
		 this.refresh();			 
	},
	methods:{
		getAllTags(){
			let self = this;
			this.$request.get(tagUrl).then(function(data){		
			 	self.tags = data.data || [];
			 });			
		},
		// generateQuery(){
		// 	let tmpObj = {};
		// 	if(this.query.length>0){
		// 		this.query.forEach(function(q){
		// 			if(q.operator=='!='){//不等
		// 				tmpObj[q.field] = {
		// 					'$ne':q.value};
		// 			}else{//相等
		// 				tmpObj[q.field] = q.value;
		// 			}					
		// 		});
		// 	}

		// 	return tmpObj;
		// },
		refresh(pageIndex){
			let self = this;
			//let tmpObj = this.generateQuery();
			let tmpObj = this.query;
			let params = Object.assign({},{pageIndex: self.pageIndex - 1},tmpObj);
			 this.$request.get(todolistUrl,{
			 	params:params
			 }).then(function(data){		
			 	self.items = data.data.tasks.map(function(task){
			 		if(!task.tags){
			 			task.tags = [];
			 		}

			 		return task;
			 	});
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
				tags:[]
			}
			this.addDialogVisible = true;
			this.getAllTags();
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
			this.getAllTags();
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
	          this.$request.delete(todolistUrl+'/'+item._id).then(function(data){
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
			//this.queryDialogVisible = true;
			this.$refs.qd.show();
		},
		queryChanged(query){
			this.query = query;
			this.refresh();
		}
		// addQuery(){
		// 	this.query.push({field:"",value:"",operator:""});
		// },
		// removeQuery(q){
		// 	let index = this.query.indexOf(q);
		// 	this.query.splice(index,1);			
		// },
		// handleSetQuery(){
		// 	localStorage.query = JSON.stringify(this.query);
		// 	this.refresh();
		// 	this.queryDialogVisible=false
		// }
	}
}
</script>

<style>

</style>