<template>
  <div class="app-container">
    <div class="search">
      <div class="search-head">
        <el-button type="default" @click="query" icon="document" class="search-btn">查询</el-button>
      </div>
      <div class="search-body">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="7">
              <el-form-item label="搜索时间">
                <el-select v-model="form.day" placeholder="选择">
                  <el-option label="今日" :value="0"></el-option>
                  <el-option label="近7天" :value="7"></el-option>
                  <el-option label="近30天" :value="30"></el-option>
                  <el-option label="全部" value=""></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" fit highlight-current-row @selection-change="handleSelectionChange"
              style="width: 100%"
              ref="multipleTable">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column align="center" label='序号' min-width="75" type="index"></el-table-column>
      <el-table-column label="回收点名称" min-width="165" align="center" prop="name"></el-table-column>
      <el-table-column label="订单量" min-width="105" align="center" prop="orderCount"></el-table-column>
      <el-table-column label="回收总额(元)" min-width="115" align="center" prop="orderMoney"></el-table-column>
      <el-table-column prop="created_at" label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row)">查看</span>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog class="watchDialog" title="回收点详情" :visible.sync="dialogTableVisible">
      <div class="dialog-container"><span class="dialog-title">回收点名称</span><span>{{watchContent.name}}</span></div>
      <div class="dialog-container"><span class="dialog-title">商圈类别</span><span>{{watchContent.businessType}}</span></div>
      <div class="dialog-container"><span class="dialog-title">今日订单量</span><span>{{watchContent.orderCount}}</span></div>
      <div class="dialog-container">
        <span class="dialog-title">废品详情</span>
        <el-table :data="watchContent.retrieveKindDetails" style="margin-top: 10px">
          <el-table-column property="name" label="名称" min-width="150" align="center"></el-table-column>
          <el-table-column property="weight" label="数量（公斤）" min-width="120" align="center"></el-table-column>
          <el-table-column property="price" label="价格（元）" min-width="120" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div class="text-center" style="margin-top: 20px">
        <el-button type="primary" @click="dialogTableVisible=false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/api/recoverypoint'
  export default {
    name: 'statistics',
    data() {
      return {
        list: [],
        listLoading: true,
        multipleSelection: [],
        downloadLoading: false,
        dialogTableVisible: false,
        dialogEdit: false,
        filename: '',
        form: {
          day: ''
        },
        watchContent: '',
        pageSize: 10,
        pageSizeList: [10, 20, 30, 40],
        currentPage: 1,
        total: 0
      }
    },
    created() {
      this.listLoading = false
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData() {
        this.listLoading = true
        const { code, data, err } = await api.retrievePager({ currentPage: this.currentPage, day: this.form.day, pageSize: this.pageSize })
        this.listLoading = false
        if (code === 200) {
          this.listLoading = false
          this.list = data.array
          this.total = parseInt(data.total)
        }
      },
      query() {
        this.currentPage = 1
        this.getData()
      },
      async watchFor(sign) {
        const { code, data, err } = await api.retrieveDetail({ id: sign.id })
        if (code === 200) {
          this.dialogTableVisible = true
          this.watchContent = data
        } else {
          this.$message.error(data)
        }
      },
      submitForm() {
        console.log(this.Jurisdiction)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },

      handleSizeChange(val) {
        this.currentPage = 1
        this.pageSize = val
        this.$nextTick(() => {
          this.getData()
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.$nextTick(() => {
          this.getData()
        })
      }
    }
  }
</script>

<style scoped>

</style>



