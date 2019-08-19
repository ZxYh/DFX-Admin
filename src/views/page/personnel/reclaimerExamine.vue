<template>
  <div class="app-container">
    <div class="search">
      <div class="search-head">
        <el-button type="default" icon="document" class="search-btn" @click="query">查询</el-button>
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
      <el-table-column label="认证回收点" min-width="125" align="center" prop="recyclerPointName"></el-table-column>
      <el-table-column label="详细住址" min-width="185" align="center" prop="address"></el-table-column>
      <el-table-column label="身份证号码" min-width="185" align="center" prop="idCardNum"></el-table-column>
      <el-table-column label="审核状态" min-width="115" align="center" prop="status"></el-table-column>
      <el-table-column prop="created_at" label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row.id)">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="watchDialog" title="回收者管理" width="40%" :visible.sync="dialogTableVisible">
      <div class="dialog-container"><span class="dialog-title">用户昵称</span><span>{{watchContent.nickeName}}</span></div>
      <div class="dialog-container"><span class="dialog-title">姓名</span><span>{{watchContent.name}}</span></div>
      <div class="dialog-container"><span class="dialog-title">性别</span><span>{{watchContent.sex}}</span></div>
      <div class="dialog-container"><span class="dialog-title">年龄</span><span>{{watchContent.age}}</span></div>
      <div class="dialog-container"><span class="dialog-title">详细住址</span><span>{{watchContent.address}}</span></div>
      <div class="dialog-container"><span class="dialog-title">手机号</span><span>{{watchContent.phone}}</span></div>
      <div class="dialog-container"><span class="dialog-title">身份证号码</span><span>{{watchContent.idCardNum}}</span></div>
      <div class="dialog-container"><span class="dialog-title"> 认证回收点</span><span>{{watchContent.recyclerPointName}}</span></div>
      <!-- <div class="dialog-container"><span class="dialog-title">身份证正反面</span><span class="dialog-image IDimg"><img :src="watchContent.idCardPositive"/></span><span class="dialog-image IDimg"><img :src="watchContent.idCardObverse"/></span></div> -->
      <div class="dialog-container"><span class="dialog-title"> 认证状态</span><span>{{watchContent.authStatus}}</span></div>
      <!--<el-form label-width="80px" :rules="rules" :model="updateForm" ref="updateForm">-->
        <!--<el-form-item label="审核" prop="authStatus">-->
          <!--<el-radio-group v-model="updateForm.authStatus">-->
            <!--<el-radio label="未认证">不通过</el-radio>-->
            <!--<el-radio label="已认证">通过</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="身份" prop="ifOwn">-->
          <!--<el-radio-group v-model="updateForm.ifOwn">-->
            <!--<el-radio :label="false">回收者</el-radio>-->
            <!--<el-radio :label="true">自有回收者</el-radio>-->
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
  name: 'userExamine',
  data () {
    return {
      list: [],
      tableMaxHeight: '',
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      dialogTableVisible: false,
      filename: '',
      form: { keyWord: '', recyclerPointId: '', pointArr: [] },
      updateForm: {
        authStatus: '',
        ifOwn: ''
      },
      rules: {
        authStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        ifOwn: [
          { required: true, message: '请选择身份', trigger: 'change' }
        ]
      },
      watchId: '',
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
      const { code, data } = await api.recyclerAuthPagination({ currentPage: this.currentPage, keyWord: this.form.keyWord, pageSize: this.pageSize, recyclerPointId: this.form.recyclerPointId })
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
    async watchFor (id) {
      this.watchId = id
      const { code, data } = await api.recyclerAuthDetail({ id: this.watchId })
      if (code === 200) {
        this.watchContent = data
        this.dialogTableVisible = true
      } else {
        this.$message.error(data)
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.recyclerAuthChangeStatus({
            authStatus: this.watchContent.authStatus,
            id: this.watchId,
            ifOwn: this.watchContent.ifOwn
          }).then((res) => {
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
      this.getData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData()
    }
  }
}
</script>

<style scoped>

</style>