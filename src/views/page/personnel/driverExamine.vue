<template>
  <div class="app-container">
    <div class="search">
      <div class="search-head">
        <el-button icon="document" class="search-btn" @click="query">查询</el-button>
      </div>
      <div class="search-body">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="7">
              <el-form-item label="输入搜索">
                <el-input v-model="form.keyWord" placeholder="手机号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="回收点">
                <el-select v-model="form.recyclerPointId" placeholder="选择">
                  <el-option v-for="(point, index) in form.pointArr" :key="index" :label="point.name" :value="point.id"></el-option>
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
      <el-table-column label="用户" min-width="105" align="center" prop="name"></el-table-column>
      <el-table-column label="手机号" min-width="125" align="center" prop="phone"></el-table-column>
      <el-table-column label="性别" min-width="55" align="center" prop="sex"></el-table-column>
      <el-table-column label="年龄" min-width="55" align="center" prop="age"></el-table-column>
      <el-table-column label="认证回收点" min-width="125" align="center" prop="recyclerPintName"></el-table-column>
      <el-table-column label="详细住址" min-width="185" align="center" prop="address"></el-table-column>
      <el-table-column label="身份证号码" min-width="185" align="center" prop="idcardNum"></el-table-column>
      <el-table-column label="审核状态" min-width="115" align="center" prop="authStatus"></el-table-column>
      <el-table-column prop="created_at" label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row)">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="watchDialog" title="回收者管理" width="40%" :visible.sync="dialogTableVisible">
      <div class="dialog-container"><span class="dialog-title">用户昵称</span><span>{{watchContent.nickName}}</span></div>
      <div class="dialog-container"><span class="dialog-title">姓名</span><span>{{watchContent.name}}</span></div>
      <div class="dialog-container"><span class="dialog-title">性别</span><span>{{watchContent.sex}}</span></div>
      <div class="dialog-container"><span class="dialog-title">年龄</span><span>{{watchContent.age}}</span></div>
      <div class="dialog-container"><span class="dialog-title">详细住址</span><span>{{watchContent.address}}</span></div>
      <div class="dialog-container"><span class="dialog-title">手机号</span><span>{{watchContent.phone}}</span></div>
      <div class="dialog-container"><span class="dialog-title">身份证号码</span><span>{{watchContent.idCardNum}}</span></div>
      <div class="dialog-container"><span class="dialog-title"> 认证回收点</span><span>{{watchContent.recyclerPointName}}</span></div>
      <!-- <div class="dialog-container"><span class="dialog-title">身份证正反面</span><span class="dialog-image IDimg"><img :src="watchContent.idCardPositive"/></span><span class="dialog-image IDimg"><img :src="watchContent.idCardObverse"/></span></div> -->
      <div class="dialog-container"><span class="dialog-title"> 车牌号</span><span>{{watchContent.cardNum}}</span></div>
      <div class="dialog-container"><span class="dialog-title"> 认证状态</span><span>{{watchContent.authStatus}}</span></div>
      <!--<el-form :rules="rules" :model="watchContent" ref="watchContent" label-width="80px">-->
      <!--<el-form-item label="审核" prop="authStatus">-->
      <!--<el-radio-group v-model="watchContent.authStatus">-->
      <!--<el-radio label="不通过"></el-radio>-->
      <!--<el-radio label="通过"></el-radio>-->
      <!--</el-radio-group>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
      <!--<el-button type="primary" @click="submitForm('watchContent')">确定</el-button>-->
      <!--<el-button @click="dialogTableVisible = false">取消</el-button>-->
      <!--</el-form-item>-->
      <!--</el-form>-->
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
import api from '@/api/personnel'
import apiPoint from '@/api/recoverypoint'
export default {
  name: 'driverExamine',
  data () {
    return {
      list: [],
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      dialogTableVisible: false,
      filename: '',
      form: {
        keyWord: '',
        recyclerPointId: '',
        pointArr: []
      },
      Jurisdiction: {
        examine: '',
        identity: '',
        state: ''
      },
      watchContent: '',
      pageSize: 10,
      pageSizeList: [10, 20, 30, 40],
      currentPage: 1,
      total: 0
    }
  },
  created () {
    this.getData()
    this.getPoint()
  },
  methods: {
    async getData () {
      this.listLoading = true
      const { code, data } = await api.driverAuthPagination({ currentPage: this.currentPage, keyWord: this.form.keyWord, pageSize: this.pageSize, recyclerPointId: this.form.recyclerPointId })
      this.listLoading = false
      if (code === 200) {
        this.listLoading = false
        this.list = data.array
        this.total = parseInt(data.total)
      }
    },
    async getPoint () {
      const { code, data } = await apiPoint.pagination({ currentPage: 1, pageSize: 10})
      if (code === 200) {
        if (parseInt(data.array.total) > 10) {
          apiPoint.pagination({ currentPage: 1, pageSize: parseInt(data.array.total) }).then(res => {
            this.form.pointArr = res.data.array
          })
        } else {
          this.form.pointArr = data.array
        }
      }
    },
    query () {
      this.currentPage = 1
      this.getData()
    },
    async watchFor (sign) {
      this.watchId = sign.id
      const { code, data } = await api.driverAuthDetail({ id: this.watchId })
      if (code === 200) {
        this.dialogTableVisible = true
        this.watchContent = data
      } else {
        this.$message.error(data)
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.driverAuthChangeStatus({ authStatus: this.watchContent.authStatus }).then((res) => {
            if (res.code === 200) {
              this.dialogTableVisible = false
              this.$message.success('成功修改审核状态')
              this.getData()
            }else {
              this.$message.error(res.data)
            }
          })
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      this.getData ()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData ()
    }
  }
}
</script>

<style scoped>

</style>

