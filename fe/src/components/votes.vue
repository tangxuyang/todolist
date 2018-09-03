<template>
	<div>
		<h1>投票</h1> 
		<el-button type="primary" @click="addItem">+新增</el-button>
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
				label="类型"
				:min-width="tableMinWidth"
			>
				<template scope="scope">
					{{voteType(scope.row.type)}}
				</template>
			</el-table-column>
			<el-table-column
				label="选项"
				:min-width="tableMinWidth"				
			>
				<template scope="scope">
                    <div v-if="scope.row.type == 1 || scope.row.type == 2">
					    <p v-for="o in scope.row.options">{{o.val}} - {{o.text}}</p>
                    </div>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<a :href="'/voteRecords/' + scope.row._id">投票记录</a>
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
	</div>
</template>
<script>
import apiUrls from '@/configs/apis';
let voteListUrl = apiUrls.voteList['default'];

import Vote from '@/models/Vote';
import VoteList from '@/models/VoteList';


export default {
	name:"votes",
	components:{
	},
	data(){		
		return {
			items:[],
			total:0,
			pageSize:10,
			pageIndex:1,
			tableMinWidth: window.innerWidth > 900 ? '' : '1'
		};
	},
	created(){
		this.voteList = new VoteList(voteListUrl);

		window.addEventListener('resize', ()=>{ this.tableMinWidth = window.innerWidth > 900 ? '' : '1'});

        this.refresh();
	},
	mounted(){
		 	 
	},
	methods:{
        voteType(type) {
            switch(+type) {
                case 1:

                return "单选";

                case 2:

                return "多选";

                default:

                return "文本";
            }
        },	
		refresh(pageIndex){
			let self = this;		
			let params = Object.assign({},{pageIndex: self.pageIndex - 1});			
			this.voteList.getList(params)
			.then(function(data){		
			 	self.items = data.data.votes;
			 	self.total = data.data.total;
			 });
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
								content: "类型";							
							}
							&:nth-child(4)::before {
								content: "选项";							
							}
							&:nth-child(5)::before {
								content: "操作";							
							}
						}
					}	
				}
				
				
		}
	}

	
</style>