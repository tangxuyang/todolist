<template>
	<div>
		<h1>任务列表</h1> 
		<el-button type="primary" @click="addItem">新增任务</el-button>
		<el-button type="warning" @click="setQuery">设置查询条件</el-button><br/><br/>
		<el-table :data="items" class="todo-list">
			<el-table-column 
				type="index"
				:min-width="tableMinWidth"
			>
			</el-table-column>
			<el-table-column
				prop="title"
				label="标题"
				:min-width="tableMinWidth"
			></el-table-column>
			<el-table-column				
				label="描述"
				:min-width="tableMinWidth"
			>
				<template scope="scope">
					<div v-html="scope.row.desc">
					</div>
				</template>
			</el-table-column>
			<el-table-column
				label="标签"
				:min-width="tableMinWidth"				
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
				:min-width="tableMinWidth"
			>
				<template scope="scope">
					<div v-html="scope.row.remark">
					</div>
				</template>
			</el-table-column>
			<el-table-column
				prop="status"
				label="状态"
				:min-width="tableMinWidth"
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
					<a href="javascript:;" @click="gotoDetail(scope.row)">查看:)</a>
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
		<QueryDialog ref="qd" @queryChanged="queryChanged" />
	</div>
</template>
<script>
import apiUrls from '@/configs/apis';
let todolistUrl = apiUrls.todolist['default'];
let tagUrl = apiUrls.tag['default'];

import UEditor from '@/components/UEditor';
import QueryDialog from '@/components/queryDialog';
import Todo from '@/models/Todo';
import TodoList from '@/models/TodoList';


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
			tagColors:['#aaa','#3c3c3c','#ccc','#cc3388'],
			tableMinWidth: window.innerWidth > 900 ? '' : '1'
		};
	},
	created(){
		this.todoList = new TodoList(todolistUrl);

		window.addEventListener('resize', ()=>{ this.tableMinWidth = window.innerWidth > 900 ? '' : '1'});
	},
	mounted(){
		 this.query = this.$refs.qd.generateQuery();
		 this.refresh();			 
	},
	methods:{
		getAllTags(){
			let self = this;
			this.$request.get(tagUrl).then(function(data){		
			 	self.tags = data.data || [];
			 });			
		},		
		refresh(pageIndex){
			let self = this;		
			let tmpObj = this.query;
			let params = Object.assign({},{pageIndex: self.pageIndex - 1},tmpObj);			
			this.todoList.getTodoes(params)
			.then(function(data){		
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
			this.item = new Todo();
			this.addDialogVisible = true;
			this.getAllTags();
		},
		addItemConfirm(){
			this.item.status="没开始";
			let self = this;			
			this.todoList.addTodo(this.item).then(function(data){
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
			this.todoList.modifyTodo(this.item).then(function(data){
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
	          this.todoList.deleteTodo(item._id).then(function(data){
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
			this.$refs.qd.show();
		},
		queryChanged(query){
			this.query = query;
			this.refresh();
		},
		gotoDetail(item) {
			this.$router.push('/todo/' + item._id);
		}
	}
}
</script>
<style lang="less">
	@media screen and (max-width: 900px) {
		.el-table {
			.el-table__header-wrapper {
				display: none;
			}
			.el-table__body-wrapper {
				colgroup {
					display: none;
				}
				table {
					width: 100%;
				}
				tbody {
					width: 100% !important;
					tr {
						display: block;
						width: 100%;
						border-top: 2px solid green;
					}
					td{
						position: relative;
						height: auto;
						width: 100%;
						padding: 6px 0;
						
						display: flex;
						align-items: center;
						> div {
							width: 100%;
							margin-left: 60px;
							overflow: auto;
						}

						&::before {
							position: absolute;
							font-weight: bold;
							margin-left: 10px;							
							display: block;
							float: left;
							width: 60px;
						}						

						.cell > div:empty {
							&:before {
								content: '--';								
							}							
						}
					} 
				}
			}
		}

		.todo-list {			
			.el-table__body-wrapper {								
					tbody {
						td {
							&:nth-child(1)::before {
								content: "序号";							
							}
							&:nth-child(2)::before {
								content: "标题";							
							}
							&:nth-child(3)::before {
								content: "描述";							
							}
							&:nth-child(4)::before {
								content: "标签";							
							}
							&:nth-child(5)::before {
								content: "备注";							
							}
							&:nth-child(6)::before {
								content: "状态";							
							}
							&:nth-child(7)::before {
								content: "操作";							
							}
						}
					}	
				}
				
				
		}
	}

	
</style>