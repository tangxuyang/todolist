<template>
	<div>
		<h1>投票记录</h1> 
		<el-table :data="items" class="todo-list">
			<el-table-column 
				type="index"
				:min-width="tableMinWidth"
			>
			</el-table-column>
			<el-table-column
				prop="name"
				label="姓名"
				:min-width="tableMinWidth"
			></el-table-column>
			<el-table-column				
				label="um"
                prop=""um
				:min-width="tableMinWidth"
			>
			</el-table-column>
			<el-table-column
				label="选项"
                prop="selectedStr"
				:min-width="tableMinWidth"				
			>
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
let recordListUrl = apiUrls.voteRecordList['default'];
let voteListUrl = apiUrls.voteList['default'];


import Vote from '@/models/Vote';
import Record from '@/models/Record';
import RecordList from '@/models/RecordList';
import VoteList from '@/models/VoteList';


export default {
	name:"records",
	components:{
	},
	data(){		
		return {
			items:[],
            vote: {},
			total:0,
			pageSize:10,
			pageIndex:1,
			tableMinWidth: window.innerWidth > 900 ? '' : '1'
		};
	},
	created(){
		this.voteList = new voteList(voteListUrl);
        this.recordList = new RecordList(recordListUrl);

		window.addEventListener('resize', ()=>{ this.tableMinWidth = window.innerWidth > 900 ? '' : '1'});

        this.recordList.getItem(this.$route.params.id).then(data=>{
            this.vote = data.data.data;

            this.refresh();
        });
	},
	mounted(){
		
	},
	methods:{	
        selectedStr(v) {
            if(v.type == 1) {// 单选
                let options = this.vote.options.filter(o=> o._id == v.selected);
                if(options.length == 1) {
                    return options[0].text;
                }

                return "";
            }

            if(v.type == 2) {// 多选
                let options = this.vote.options.filter(o=> (v.selected || []).contains(o._id)) || [];
                
                return options.map(o=> o.text).join('\n');
            }

            if(v.type == 3) {// 文本
                return v.selected;
            }
        },
		refresh(pageIndex){
			let self = this;		
			let params = Object.assign({},{pageIndex: self.pageIndex - 1});			
			this.voteList.getList(params)
			.then(function(data){		
			 	self.items = data.data.voteRecords.map(v=>{
                     v.selectedStr = self.selectedStr(v);
                     return v;
                 });
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