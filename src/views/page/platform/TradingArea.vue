<template>
  <div class="app-container">
    <div class="search">
      <div class="search-head">
        <el-button icon="document" class="search-btn" @click="query">查询</el-button>

      </div>
      <div class="search-body">
        <el-form label-width="80px">
          <el-row>
            <el-col :span="7">
              <el-form-item label="输入搜索">
                <el-input v-model="keyWord" placeholder="商圈名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="17" class="add-right">
              <el-button type="default" icon="document" class="search-btn" @click="dialogAdd=true">新建</el-button>
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
      <el-table-column label="商圈编号" min-width="135" align="center" prop="id"></el-table-column>
      <el-table-column label="商圈名称" min-width="135" align="center" prop="name"></el-table-column>
      <el-table-column label="创建时间" min-width="135" align="center" prop="createdAt"></el-table-column>
      <el-table-column prop="created_at" min-width="105" align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row)">编辑</span>
          <span class="watch" @click="del(scope.row)">删除</span>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog class="watchDialog" title="商圈设置" :visible.sync="dialogTableVisible">
      <el-form ref="checkName" :model="checkName" label-width="120px" style="margin-right: 60px">
        <el-form-item label="商圈名称" prop="name"
          :rules="[
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]"
        >
          <el-input v-model="checkName.name" :placeholder="watchContent.name"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-container text-center">
        <el-button type="primary" :disabled="checkDisabled" @click="submirCheck('checkName')">确定</el-button>
        <el-button @click="dialogTableVisible=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog class="watchDialog" title="新增商圈" :visible.sync="dialogAdd">
      <el-form ref="addForm" :model="addForm" label-width="120px" style="margin-right: 60px">
        <el-form-item label="商圈名称" prop="name"
          :rules="[
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="addDisabled" @click="submitAdd('addForm')">提交</el-button>
          <el-button type="default" @click="dialogAdd=false">取消</el-button>
        </el-form-item>
      </el-form>
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
  import api from '@/api/platform'
  export default {
    name: 'list',
    data() {
      return {
        list: [],
        listLoading: true,
        multipleSelection: [],
        downloadLoading: false,
        dialogTableVisible: false,
        dialogAdd: false,
        filename: '',
        keyWord: '',
        editForm: {
          title: '',
          type: '',
          address: ''
        },
        addForm: { name: '' },
        addDisabled: false,
        watchContent: '',
        checkName: { name: '' },
        checkDisabled: false,
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
        const { code, data, err } = await api.businessPagination({ currentPage: this.currentPage, keyWord: this.keyWord, pageSize: this.pageSize })
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
      submitAdd (formName) {
        this.$refs[formName].validate(valid => {
          this.addDisabled = true
          api.businessAdd({
            name: this.addForm.name,
          }).then(res => {
            this.addDisabled = false
            if (res.code === 200) {
                this.dialogAdd = false
                this.$message.success('创建成功')
                this.getData()
              } else {
                this.$message.error(res.err)
              }
          })
        })
      },
      watchFor(sign) {
        this.watchContent = sign
        this.dialogTableVisible = true
      },
      submirCheck (formName) {
         this.$refs[formName].validate(valid => {
           if (this.watchContent.name !== this.checkName.name) {
            this.checkDisabled = true
            api.businessUpdateName({
              name: this.checkName.name,
              id: this.watchContent.id
            }).then(res => {
              this.checkDisabled = false
              if (res.code === 200) {
                  this.dialogTableVisible = false
                  this.$message.success('创建成功')
                  this.getData()
                } else {
                  this.$message.error(res.err)
                }
            })
           } else {
             this.$message.error('与旧名称重复，请输入新名称')
           }
        })
      },
      del(sign) {
        this.$confirm('是否删除商圈?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.listLoading = true
          api.businessDelete({
            id: sign.id
          }).then(res => {
            this.listLoading = false
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getData()
            } else {
              this.$message.error(res.data)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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



