<template>
	<el-dialog
		title="设置查询条件"
		:visible.sync="visible"
		size="small"
	>
		<el-button type="primary" size="small" @click="addQuery">新增查询条件</el-button><br/><br/>
		<el-table :data="query">
			<el-table-column
			label="enabled"				
			>
				<template scope="scope">
					<el-checkbox v-model="scope.row.enabled"> </el-checkbox>
				</template>				
			</el-table-column>
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
					      v-for="item in ['=','!=','in','not in']"
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
		    <el-button type="primary" @click="setQuery">确 定</el-button>
		</span>	
	</el-dialog>
</template>
<script type="text/javascript">
	
	export default {
		name:"queryDialog",
		//props:["visible"],
		data(){			
			let query = this.getQuery();
			return {
				query:query,
				visible:false,
			};
		},
		methods:{
			getQuery(){
				return JSON.parse(localStorage.query||'[]');//从localStorage中读取
			},
			generateQuery(){
				let tmpObj = {};
				if(this.query.length>0){
					this.query.filter(function(q){
						return !!q.enabled;
					}).forEach(function(q){
						switch(q.operator){
							case '!=':
								tmpObj[q.field] = {
								'$ne':q.value};
							break;
							case '=':
								tmpObj[q.field] = q.value;
							break;
							case 'in':
								let tmpArr = q.value.split(',');
								if(tmpArr.length>0){
									tmpObj[q.field] = {$in: tmpArr};
								}
							break;
							case 'not in':
								let tmpArr2 = q.value.split(',');
								if(tmpArr2.length>0){
									tmpObj[q.field] = {$nin: tmpArr2};
								}
							break;
							default:

							break;
						}					
					});
				}

				return tmpObj;
			},
			setQuery(){
				localStorage.query = JSON.stringify(this.query);//保存到localStorage				
				this.visible=false
				this.$emit('queryChanged',this.generateQuery());//触发queryChanged事件
			},
			removeQuery(q){
				let index = this.query.indexOf(q);
				this.query.splice(index,1);			
			},
			addQuery(){
				this.query.push({field:"",value:"",operator:""});
			},
			show(){
				this.visible = true;
			}
		}
	}
</script>
<style>

</style>