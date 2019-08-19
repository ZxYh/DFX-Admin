<template>
  <div class="app-container">
    <div class="search">
      <div class="search-head">
        <el-button icon="document" class="search-btn" @click="query">查询</el-button>

      </div>
      <div class="search-body">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="订单号">
                <el-input v-model="form.keyWord" placeholder="搜索订单号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="完成时间">
                <el-select v-model="form.day" placeholder="选择">
                  <el-option label="今日" :value="0"></el-option>
                  <el-option label="七天内" :value="7"></el-option>
                  <el-option label="一个月内" :value="30"></el-option>
                  <el-option label="不限" value=""></el-option>
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
      <el-table-column label="订单号" min-width="185" align="center" prop="id"></el-table-column>
      <el-table-column label="回收商" min-width="155" align="center" prop="recyclerMerchantName"></el-table-column>
      <el-table-column label="回收人" min-width="135" align="center" prop="recyclerName"></el-table-column>
      <el-table-column label="司机" min-width="135" align="center" prop="driverName"></el-table-column>
      <el-table-column label="完成时间" min-width="155" align="center" prop="completedAt"></el-table-column>
      <el-table-column label="交易金额（元）" min-width="125" align="center" prop="money"></el-table-column>
      <el-table-column label="交易状态" min-width="125" align="center" prop="status"></el-table-column>
      <el-table-column prop="created_at" label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row.id)">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="watchDialog" title="充值记录" width="40%" :visible.sync="dialogTableVisible">
      <div class="dialog-container"><span class="dialog-title">订单号</span><span>{{ watchContent.id }}</span></div>
      <div class="dialog-container"><span class="dialog-title">回收商</span><span>{{ watchContent.recyclerMerchantName }}</span></div>
      <div class="dialog-container"><span class="dialog-title">回收人</span><span>{{ watchContent.recyclerName }}</span></div>
      <div class="dialog-container"><span class="dialog-title">司机</span><span>{{ watchContent.driverName }}</span></div>
      <div class="dialog-container"><span class="dialog-title">交易时间</span><span>{{ watchContent.completedAt }}</span></div>
      <div class="dialog-container"><span class="dialog-title">交易状态</span><span>{{ watchContent.status }}</span></div>
      <div class="dialog-container text-center">
        <el-button @click="dialogTableVisible=false">确定</el-button>
      </div>
    </el-dialog>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import api from '@/api/finance'
  export default {
    name: 'record',
    data() {
      return {
        list: [],
        listLoading: true,
        multipleSelection: [],
        downloadLoading: false,
        dialogTableVisible: false,
        filename: '',
        form: {
          name: '',
          phone: ''
        },
        editForm: {
          title: '',
          type: '',
          address: ''
        },
        watchContent: '',
        pageSize: 10,
        pageSizeList: [10, 20, 30, 40],
        currentPage: 1,
        total: 0
      }
    },
    created() {
      this.getData()
    },
    methods: {
     async getData() {
        this.listLoading = true
        const { code, data, err } = await api.transactionPagination({ currentPage: this.currentPage, pageSize: this.pageSize, name: this.form.name, phone: this.form.phone })
        this.listLoading = false
        if (code === 200) {
            this.list = data.array
            this.total = parseInt(data.total)
        }
      },
      query() {
        this.currentPage = 1
        this.getData()
      },
      async watchFor(id) {
        const { code, data, err } = await api.transactionDetail({ id: id })
        if(code === 200) {
          this.watchContent = data
          this.dialogTableVisible = true
        } else {
          this.$message.error(err)
        }
      },
      submitForm() {
        console.log(this.Jurisdiction)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleSizeChange(val) {
        this.currentPage = 1
        this.pageSize = val
        this.getData()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getData()
      }
    }
  }
</script>

<style scoped>

</style>


