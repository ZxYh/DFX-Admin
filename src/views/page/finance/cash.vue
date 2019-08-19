<template>
  <div class="app-container">
    <div class="search">
      <div class="search-head">
        <el-button type="default" icon="document" @click="handleDownload" :loading="downloadLoading">导出excel</el-button>
        <el-button icon="document" class="search-btn" @click="query">查询</el-button>

      </div>
      <div class="search-body">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="7">
              <el-form-item label="输入搜索">
                <el-input v-model="form.name" placeholder="用户"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="输入搜索">
                <el-input v-model="form.phone" placeholder="手机号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态">
                <el-select v-model="form.status" placeholder="选择">
                  <el-option label="待审核" :value="1"></el-option>
                  <el-option label="审核通过" :value="2"></el-option>
                  <el-option label="审核不通过" :value="3"></el-option>
                  <el-option label="不限" value=""></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <el-table id="out-table" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" fit highlight-current-row @selection-change="handleSelectionChange"
              style="width: 100%"
              ref="multipleTable">
      <el-table-column type="selection" align="center"></el-table-column>

      <el-table-column align="center" label='序号' min-width="75" type="index"></el-table-column>

      <el-table-column label="姓名" min-width="75" align="center" prop="name"></el-table-column>
      <el-table-column label="提现方式" min-width="105" align="center" prop="way"></el-table-column>
      <el-table-column label="提现金额（元）" min-width="105" align="center" prop="money"></el-table-column>
      <el-table-column label="申请时间" min-width="185" align="center" prop="createdAt"></el-table-column>
      <el-table-column label="状态" min-width="115" align="center" prop="stauts"></el-table-column>
      <el-table-column prop="created_at" label="操作" min-width="115" align="center">
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row)">查看</span>
          <span v-show="scope.row.stauts==='未审核'" class="watch" @click="adoptAlert(true, scope.row.id)">通过</span>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog class="watchDialog" title="提现管理" :visible.sync="dialogTableVisible">
      <div class="dialog-container"><span class="dialog-title">名称</span><span>{{watchContent.name}}</span></div>
      <div class="dialog-container"><span class="dialog-title">提现方式</span><span>{{watchContent.way}}</span></div>
      <div class="dialog-container"><span class="dialog-title">手机号</span><span>{{watchContent.phone}}</span></div>
      <div class="dialog-container"><span class="dialog-title">提现金额</span><span>{{watchContent.money}}</span></div>
      <div class="dialog-container"><span class="dialog-title">申请时间</span><span>{{watchContent.createdAt}}</span></div>
      <div class="dialog-container" v-if="watchContent.status==='未审核'">
        <span class="dialog-title">审核</span>
        <el-radio-group v-model="change.status">
          <el-radio :label="true">通过</el-radio>
          <el-radio :label="false">不通过</el-radio>
        </el-radio-group>
      </div>
      <div v-else class="dialog-container">
        <span class="dialog-title">状态</span>
        <span>{{watchContent.status}}</span>
      </div>
      <div class="dialog-container text-center" v-if="watchContent.status==='未审核'">
        <el-button type="primary" @click="adoptDialog(change.status, watchContent.id)">确定</el-button>
        <el-button @click="dialogTableVisible=false">取消</el-button>
      </div>
      <div class="dialog-container text-center" v-else>
        <el-button type="primary" @click="dialogTableVisible=false">确定</el-button>
      </div>
    </el-dialog>
    <div class="flex-between dialog-container">
      <div class="allForm">
        <el-checkbox class="allForm-item" v-model="allForm.checked" @change="chooseAll(list)">全选</el-checkbox>
        <el-select class="allForm-item" v-model="allForm.value" placeholder="请选择">
          <el-option label="批量通过" value="all">
          </el-option>
        </el-select>
        <el-button small @click="allAdopt">确定</el-button>
      </div>

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
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    import api from '@/api/finance'
  export default {
    name: 'cash',
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
          phone: '',
          status: ''
        },
        change: {
          status: ''
        },
        allForm: {
          checked: false,
          value: 'all'
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
        const { code, data, err } = await api.withdrawPagination({ currentPage: this.currentPage, pageSize: this.pageSize, name: this.form.name, phone: this.form.phone, status: this.form.status })
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
      handleSelectionChange(val) {
        this.multipleSelection = val
        if (this.multipleSelection.length===this.list.length) {
          this.allForm.checked = true
        } else {
          this.allForm.checked = false
        }
      },
      chooseAll(list) {
        if (this.allForm.checked) {
          this.$refs.multipleTable.toggleAllSelection(list);
          this.multipleSelection = list
        } else {
          this.$refs.multipleTable.clearSelection();
          this.multipleSelection = []
        }
      },
      allAdopt() {
        if (this.multipleSelection.length) {
          let idList = this.multipleSelection.map(item => {
            return item.id
          })
         this.$message.warning('正在审核')
          api.withdrawChangeMultiple({
            idList: idList,
            ifPass: true
          }).then(res =>{
            if(res.code === 200) {
              this.$message.success('审核通过!')
              this.getData()
            } else {
              this.$message.error(res.err)
            }
          })
        } else {
          this.$message({
            message: '请至少选择一条记录',
            type: 'warning'
          })
        }
      },
      adoptAlert(status, id) {
        this.$confirm('是否通过审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.listLoading = true
          this.adoptDialog(status, id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消审核'
          })
        })
      },
      async adoptDialog(sign, id) {
        console.log(sign)
        if(sign === true||sign === false) {
          const { code, data, err } = await api.withdrawChange({ id: id, ifPass: sign })
          this.listLoading = false
          if (code === 200) {
            this.getData()
            this.dialogTableVisible = false
            this.$message({ type: 'success', message: '操作成功' })
          } else {
            this.$message.error(err)
          }
        } else {
          this.dialogTableVisible = false
        }
      },
      adopt(sign) {
        this.list.forEach((eve, index) => {
          if (eve === sign) {
            this.list[index].state = '已通过'
            this.list[index].adopt = true
            this.dialogTableVisible = false
          }
        })
      },
      async watchFor(sign) {
        const { code, data, err } = await api.withdrawDetail({ id: sign.id })
        if (code === 200) {
          this.dialogTableVisible = true
          this.watchContent = data
          this.change.status = ''
        } else {
          this.$message.error(err)
        }
      },
      async handleDownload () {
        this.listLoading = true
        const res = await api.withdrawExcel({ currentPage: this.currentPage, pageSize: this.pageSize, name: this.form.name, phone: this.form.phone, status: this.form.status })
        this.listLoading = false
        if (res.status === 200) {
          const content = res.data
          const blob = new Blob([content])
          const fileName = 'cash.xlsx'
          // const fileName = window.decodeURI(res.headers['content-disposition'].split('filename=')[1].replace(/\"/g, ''))
          if ('download' in document.createElement('a')) {
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href)
            document.body.removeChild(elink)
          } else {
            navigator.msSaveBlob(blob, fileName)
          }
        }
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
  .noAdopt{
    color: #F56C6C;
  }
  .adopt{
    color: #67C23A;
  }
  .allForm{
    padding: 0 20px;
  }
  .allForm-item{
    margin-right: 10px;
  }
</style>
