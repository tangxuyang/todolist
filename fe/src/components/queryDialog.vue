<template>
	<el-dialog
		title="设置查询条件"
		:visible.sync="visible"
		size="small"
	>
		<el-button type="primary" size="small" @click="addQuery">新增查询条件</el-button><br/><br/>
		<el-table :data="query" class="query-table">
			<el-table-column
			label="enabled"		
			width="1"		
			>
				<template scope="scope">
					<el-checkbox v-model="scope.row.enabled"> </el-checkbox>
				</template>				
			</el-table-column>
			<el-table-column
			label="字段"
			width="1"		
			>
				<template scope="scope">
					<el-input v-model="scope.row.field"></el-input>
				</template>
			</el-table-column>
			<el-table-column 
			label="操作符"
			width="1"		
			>
				<template scope="scope">
					<el-select v-model="scope.row.operator" placeholder="请选择">
					    <el-option
					      v-for="item in ['=','!=','in','not in','like']"
					      :key="item"
					      :label="item"
					      :value="item">
					    </el-option>
					  </el-select>
				</template>
			</el-table-column>
			<el-table-column
				label="值"
				width="1"		
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
  name: "queryDialog",
  data() {
    let query = this.getQuery();
    return {
      query: query,
      visible: false
    };
  },
  methods: {
    getQuery() {
      return JSON.parse(localStorage.query || "[]"); //从localStorage中读取
    },
    generateQuery() {
      let tmpObj = {};
      if (this.query.length > 0) {
        this.query
          .filter(function(q) {
            return !!q.enabled;
          })
          .forEach(function(q) {
            switch (q.operator) {
              case "!=":
                tmpObj[q.field] = {
                  $ne: q.value
                };
                break;
              case "=":
                tmpObj[q.field] = q.value;
                break;
              case "in":
                let tmpArr = q.value.split(",");
                if (tmpArr.length > 0) {
                  tmpObj[q.field] = { $in: tmpArr };
                }
                break;
              case "not in":
                let tmpArr2 = q.value.split(",");
                if (tmpArr2.length > 0) {
                  tmpObj[q.field] = { $nin: tmpArr2 };
                }
                break;
              case "like":
                tmpObj[q.field] = { $like: q.value };
                break;
              default:
                break;
            }
          });
      }

      return tmpObj;
    },
    setQuery() {
      localStorage.query = JSON.stringify(this.query); //保存到localStorage
      this.visible = false;
      this.$emit("queryChanged", this.generateQuery()); //触发queryChanged事件
    },
    removeQuery(q) {
      let index = this.query.indexOf(q);
      this.query.splice(index, 1);
    },
    addQuery() {
      this.query.push({ field: "", value: "", operator: "" });
    },
    show() {
      this.visible = true;
    }
  }
};
</script>
<style lang="less">
@media screen and (max-width: 900px) {
  .query-table {
    .el-table__body-wrapper {      
        tbody {
          td {
            &:nth-child(1)::before {
              content: "有效";
            }
            &:nth-child(2)::before {
              content: "字段";
            }
            &:nth-child(3)::before {
              content: "符号";
            }
            &:nth-child(4)::before {
              content: "值";
            }
            &:nth-child(5)::before {
              content: "操作";
            }
          }
        }      
    }
  }
  .el-dialog--small {
    width: 90%;
  }
}
</style>