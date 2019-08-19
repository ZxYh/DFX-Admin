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
                <el-input v-model="keyWord" placeholder="废品名称"></el-input>
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
      <el-table-column label="废品分类编号" min-width="135" align="center" prop="id"></el-table-column>
      <el-table-column label="废品分类名称" min-width="135" align="center" prop="name"></el-table-column>
      <el-table-column label="用户废品单价" min-width="115" align="center" prop="userPrice"></el-table-column>
      <el-table-column label="企业废品单价" min-width="115" align="center" prop="enterprisePrice"></el-table-column>
      <el-table-column label="创建时间" min-width="185" align="center" prop="createdAt"></el-table-column>
      <el-table-column prop="created_at" min-width="105" align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row)">编辑</span>
          <span class="watch" @click="del(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="watchDialog" title="商圈设置" :visible.sync="dialogTableVisible">
      <el-form ref="editForm" :model="editForm" :rules="addRules " label-width="120px" style="margin-right: 60px">
        <el-form-item label="废品名称" prop="name">
          <el-input v-model="editForm.name" :placeholder="watchContent.name"></el-input>
        </el-form-item>
        <el-form-item label="企业废品单价" prop="enterprisePrice">
          <el-input type="number" step="0.01" v-model="editForm.enterprisePrice" :placeholder="watchContent.enterprisePrice"></el-input>
        </el-form-item>
        <el-form-item label="用户废品单价" prop="userPrice">
          <el-input type="number" step="0.01" v-model="editForm.userPrice" :placeholder="watchContent.userPrice"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-container text-center">
        <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
        <el-button @click="dialogTableVisible=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog class="watchDialog" title="新增废品类型" :visible.sync="dialogAdd">
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="120px" style="margin-right: 60px">
        <el-form-item label="废品名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="企业废品单价" prop="enterprisePrice">
          <el-input type="number" step="0.01" v-model="addForm.enterprisePrice"></el-input>
        </el-form-item>
        <el-form-item label="用户废品单价" prop="userPrice">
          <el-input type="number" step="0.01" v-model="addForm.userPrice"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-center dialog-container">
        <el-button type="primary" @click="submitAdd('addForm')">提交</el-button>
        <el-button type="default" @click="dialogAdd=false">取消</el-button>
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
  import api from '@/api/platform'
  export default {
    name: 'classification',
    data () {
      var checkNum = (rule, value, callback) => {
        let rgx = /^\d+(\.\d{1,2})?$/
        if (!value) {
          return callback(new Error('废品单价不能为空'))
        }
        setTimeout(() => {
          if (value.match(rgx) === null) {
            callback(new Error('最多两位小数'))
          } else {
            callback()
          }
        }, 100)
      }
      return {
        list: [],
        listLoading: true,
        multipleSelection: [],
        downloadLoading: false,
        dialogTableVisible: false,
        dialogAdd: false,
        filename: '',
        editForm: {
          name: '',
          userPrice: '',
          enterprisePrice: ''
        },
        addForm: {
          name: '',
          userPrice: '',
          enterprisePrice: ''
        },
        addRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          userPrice: [
            { required:true, validator: checkNum, trigger: 'change' },
          ],
          enterprisePrice: [
            { required:true, validator: checkNum, trigger: 'change' },
          ]
        },
        watchContent: '',
        keyWord: '',
        pageSize: 10,
        pageSizeList: [10, 20, 30, 40],
        currentPage: 1,
        total: 0
      }
    },
    created () {
      this.getData()
    },
    methods: {
      async getData () {
        this.listLoading = true
        const { code, data, err } = await api.scrapPagination({ currentPage: this.currentPage, keyWord: this.keyWord, pageSize: this.pageSize })
        this.listLoading = false
        if (code === 200) {
          this.list = data.array
          this.total = parseInt(data.total)
        }
      },
      query () {
        this.currentPage = 1
        this.getData()
      },
      async watchFor (sign) {
        const { code, data, err } = await api.scrapDetail({ id: sign.id })
        if(code === 200) {
          this.watchContent = data
          this.dialogTableVisible = true
        } else {
          this.$message.error(err)
        }
        this.dialogTableVisible = true
      },
      submitAdd (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            api.scrapAdd({
              name: this.addForm.name,
              enterprisePrice: this.addForm.enterprisePrice,
              userPrice: this.addForm.userPrice
            }).then(res => {
              if (res.code === 200) {
                this.dialogAdd = false
                this.$message.success('创建成功')
                this.getData()
              } else {
                this.$message.error(res.err)
              }
            })
          }
        })
      },
      del (sign) {
        this.$confirm('是否删除当前选项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          console.log(sign.id)
          api.scrapDelete({
              id: sign.id
            }).then(res => {
              if (res.code === 200) {
                this.getData()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              } else {
                this.$message.error(res.err)
              }
            })
          this.list.forEach((eve, index) => {
            if (eve.sign === sign.sign) {
              this.list.splice(index, 1)
              
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      useOpenChange (sign) {
        if (sign.use) {
          this.$confirm('是否禁用当前管理员?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            sign.use = false
            this.$message({
              type: 'success',
              message: '已禁用'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          this.$confirm('是否启用当前管理员?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            sign.use = true
            this.$message({
              type: 'success',
              message: '启用成功'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            api.scrapUpdate({
              id: this.watchContent.id,
              name: this.editForm.name,
              enterprisePrice: this.editForm.enterprisePrice,
              userPrice: this.editForm.userPrice
            }).then(res => {
              if (res.code === 200) {
                this.dialogTableVisible = false
                this.$message.success('修改成功')
                this.getData()
              } else {
                this.$message.error(res.err)
              }
            })
          }
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


