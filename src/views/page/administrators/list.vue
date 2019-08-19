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
              <el-form-item label="输入搜索">
                <el-input v-model="form.name" placeholder="管理员姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="角色名称">
                <el-select v-model="form.roleId" placeholder="选择">
                  <el-option v-for="(i, index) in roleNameList" :key="index" :label="i.roleName" :value="i.id"></el-option>
                  <el-option label="不限" value=""></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="启用/禁用">
                <el-select v-model="form.ifEnable" placeholder="选择">
                  <el-option label="禁用" :value="false"></el-option>
                  <el-option label="启用" :value="true"></el-option>
                  <el-option label="不限" value=""></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7" class="add-right">
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
      <el-table-column label="管理员编号" min-width="105" align="center" prop="id"></el-table-column>
      <el-table-column label="管理员姓名" min-width="105" align="center" prop="name"></el-table-column>
      <el-table-column label="管理员账号" min-width="105" align="center" prop="email"></el-table-column>
      <el-table-column label="手机号码" min-width="125" align="center" prop="phone"></el-table-column>
      <el-table-column label="归属角色" min-width="145" align="center" prop="roleName"></el-table-column>
      <el-table-column label="创建时间" min-width="185" align="center" prop="createdAt"></el-table-column>
      <el-table-column label="启用/禁用" min-width="135" align="center">
        <template slot-scope="scope">
          <span @click="useOpenChange(scope.row)">
            <el-switch v-model="scope.row.ifEnable" disabled style="cursor: pointer"></el-switch>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" min-width="105" align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row)">设置</span>
          <span class="watch" @click="del(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="watchDialog" title="编辑角色" :visible.sync="dialogTableVisible">
      <el-form ref="watchContent" :rules="rules" :model="watchContent" label-width="120px" style="margin-right: 60px">
        <el-form-item label="账号" prop="email">
          <el-input v-model="watchContent.email"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="watchContent.name"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input maxlength="11" v-model.number="watchContent.phone"></el-input>
        </el-form-item>
        <el-form-item label="归属角色" prop="role">
          <el-select v-model="watchContent.role" placeholder="请选择角色">
            <el-option v-for="(i, index) in roleNameList" :key="index" :label="i.roleName" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-container text-center">
        <el-button type="primary" @click="submitEdit('watchContent')">确定</el-button>
        <el-button @click="dialogTableVisible=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog class="watchDialog" title="新增管理员" :visible.sync="dialogAdd">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="120px" style="margin-right: 60px">
        <el-form-item label="账号" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="归属角色" prop="role">
          <el-select v-model="addForm.role" placeholder="请选择角色">
             <el-option v-for="(i, index) in roleNameList" :key="index" :label="i.roleName" :value="i.id"></el-option>
          </el-select>
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
  import api from '@/api/role'
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
        roleNameList: '',
        form: {
          ifEnable: '',
          keyWord: '',
          name: '',
          offset: '',
          phone: '',
          roleId: '',
          sortBy: '',
        },
        editForm: {
          title: '',
          type: '',
          address: ''
        },
        addForm: {
          account: '',
          password: '',
          name: '',
          phone: '',
          role: ''
        },
        rules: {
          email: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          role: [
            { required: true, message: '请选择归属角色', trigger: 'change' }
          ]
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
      this.getRole()
    },
    methods: {
      async getData() {
        this.listLoading = true
        const { code, data, err } = await api.adminPaginate({ page: this.currentPage, count: this.pageSize, ifEnable: this.form.ifEnable, keyWord: this.form.keyWord, name: this.form.name, offset: this.form.offset, phone: this.form.phone, roleId: this.form.roleId, sortBy: this.form.sortBy })
        this.listLoading = false
        if (code === 200) {
          this.list = data.array
          this.total = parseInt(data.total)
        }
      },
      async getRole() {
        const { code, data, err } = await api.roleAll()
        if(code === 200) {
          this.roleNameList = data
        }
      },
      query() {
        this.currentPage = 1
        this.getData()
      },
      async watchFor(sign) {
        const { code, data, err } = await api.adminDetail({ id: sign.id })
        if(code === 200) {
          this.watchContent = data
          this.dialogTableVisible = true
        } else {
          this.$message.error(err)
        }
      },
      submitAdd(formName) {
         this.$refs[formName].validate(valid => {
          if (valid){
            this.$message.warning('创建中..')
            api.adminCreate({
              email: this.addForm.email,
              name: this.addForm.name,
              phone: this.addForm.phone,
              pwd: this.addForm.password,
              roleId: this.addForm.role
            }).then(res => {
              if(res.code === 200) {
                this.dialogAdd=false
                this.$message.success('创建成功！')
                this.getData()
              } else {
                this.$message.error(res.err)
              }
            })
          }
        })
      },
      submitEdit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid){
            this.$message.warning('修改中..')
            api.adminUpdate({
              email: this.watchContent.email,
              id: this.watchContent.id,
              name: this.watchContent.name,
              phone: this.watchContent.phone,
              roleId: this.watchContent.role
            }).then(res => {
              if(res.code === 200) {
                this.dialogTableVisible=false
                this.$message.success('修改成功！')
                this.getData()
              } else {
                this.$message.error(res.err)
              }
            })
          }
        })
      },
      del(sign) {
        this.$confirm('是否删除当前管理员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          api.adminDelete({ adminId: sign.id }).then(res => {
            if(res.code === 200) {
              this.getData()
              this.$message.success('删除成功!')
            } else {
              this.$message.error(res.err)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      useOpenChange(sign) {
        let status
        if (sign.ifEnable) {
          status = '禁用'
        } else {
          status = '启用'
        }
        this.$confirm('是否'+status+'当前管理员?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            api.adminChangeStatus({
              ids: [sign.id],
              ifEnable: !sign.ifEnable
            }).then(res => {
              if(res.code === 200) {
                this.getData()
                this.$message({
                  type: 'success',
                  message: '已'+status
                })
              } else {
                this.$message.error(res.err)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'+status
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
    },
    watch: {
      dialogTableVisible(val, oldval) {
        if (this.$refs['watchContent'] !== undefined) {
            this.$refs["watchContent"].resetFields()
        }
      }
    }
  }
</script>

<style lang="less">
  .el-switch.is-disabled{
    opacity: 1;
  }
</style>

