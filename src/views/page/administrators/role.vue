<template>
  <div class="app-container">
    <div class="search">
      <div class="search-head">
        <el-button type="default" icon="document" class="search-btn" @click="query">查询</el-button>

      </div>
      <div class="search-body">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="输入搜索">
                <el-input v-model="form.text" placeholder="角色名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="启用/禁用">
                <el-select v-model="form.ifEnable" placeholder="选择">
                  <el-option label="禁用" :value="false"></el-option>
                  <el-option label="启用" :value="true"></el-option>
                  <el-option label="不限" value=""></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="add-right">
              <el-button type="default" icon="document" class="search-btn" @click="addDialog">新建</el-button>
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
      <el-table-column label="角色编号" min-width="105" align="center" prop="id"></el-table-column>
      <el-table-column label="角色名称" min-width="145" align="center" prop="roleName"></el-table-column>
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
          <span class="watch" @click="watchFor(scope.row)">编辑</span>
          <span class="watch" @click="del(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="watchDialog" title="编辑角色" :visible.sync="dialogTableVisible">
      <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="权限列表">
           <el-tree
            :data="editForm.tree"
            :default-checked-keys="editForm.permissionKeys"
            @check-change="handleCheckChange"
            show-checkbox
            default-expand-all
            node-key="permissionKey"
            :props="defaultProps">
          </el-tree>
        </el-form-item>
        <el-form-item label="状态" prop="ifEnable">
          <el-radio-group v-model="editForm.ifEnable">
            <el-radio :label="false">禁用</el-radio>
            <el-radio :label="true">启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
     
      <div class="dialog-container text-center">
        <el-button type="primary" @click="editTree('editForm')">确定</el-button>
        <el-button @click="dialogTableVisible=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog class="watchDialog" title="新增角色" :visible.sync="dialogAdd">
      <el-form ref="addForm" :model="addForm" :rules="editRules" label-width="120px" style="margin-right: 60px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="权限列表">
          <el-tree
            :data="addForm.tree"
            :default-checked-keys="addForm.permissionKeys"
            @check-change="handleCheckChangeAdd"
            show-checkbox
            default-expand-all
            node-key="permissionKey"
            :props="defaultProps">
          </el-tree>
        </el-form-item>
      </el-form>
      <div class="text-center dialog-container">
        <el-button type="primary" @click="addTree('addForm')">确认创建</el-button>
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
    name: 'role',
    data() {
      return {
        list: [],
        listLoading: true,
        multipleSelection: [],
        downloadLoading: false,
        dialogTableVisible: false,
        dialogAdd: false,
        filename: '',
        form: {
          ifEnable: '',
          offset: '',
          sortBy: '',
          text: ''
        },
        editForm: {
          id:'',
          roleName: '',
          ifEnable: '',
          permissionKeys: [],
          tree: []
        },
        editRules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
          ],
          ifEnable: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ]
        },
        addForm: {
          roleName: '',
          permissionKeys: [],
          tree: []
        },
        watchContent: '',
        defaultProps: {
          children: 'subs',
          label: 'menuName'
        },
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
        const { code, data, err } = await api.rolePaginate({
          page: this.currentPage,
          count: this.pageSize,
          ifEnable: this.form.ifEnable,
          offset: this.form.offset,
          sortBy: this.form.sortBy,
          text: this.form.text
        })
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
      async watchFor(sign) {
        this.editForm.permissionKeys = []
        this.editForm.ifEnable = sign.ifEnable
        this.editForm.id = sign.id
        const { code, data, err } = await api.roleGetDetail({ roleId: sign.id }, sign.id)
        if(code === 200) {
          this.editForm.tree = data.permissions
          this.editForm.tree.forEach(first => {
            first.subs.forEach(seconed => {
              seconed.subs.forEach(item => {
                if(item.ifHasRight) {
                  this.editForm.permissionKeys.push(item.permissionKey)
                }
              })
            })
          })
          // console.log(sign.id)
          this.dialogTableVisible = true
        } else {
          this.$message.error(err)
        }
      },
      handleCheckChange(data, checked, indeterminate) {
        if(this.editForm.permissionKeys.indexOf(data.permissionKey) !== -1) {
          if(!checked) {
            this.editForm.permissionKeys.splice(this.editForm.permissionKeys.indexOf(data.permissionKey),1)
          }
        } else {
          if(checked) {
            if(data.subs === undefined) {
              this.editForm.permissionKeys.push(data.permissionKey)
            }
          }
        }
      },
      editTree(formName) {
        this.$refs[formName].validate(valid => {
          if (valid){
            api.roleUpdate({
              id: this.editForm.id,
              roleName: this.editForm.roleName,
              ifAllIndustry: true,
              ifEnable: this.editForm.ifEnable,
              permissionKeys: this.editForm.permissionKeys
            }).then(res => {
              if(res.code === 200) {
                this.$message.warning('正在修改')
                this.getData()
                this.$message.success('修改成功')
                this.dialogTableVisible = false
              } else {
                this.$message.error(res.err)
              }
            })
          }
        })
      },
      async addDialog() {
        this.addForm.permissionKeys = []
        const { code, data, err } = await api.roleListPermissions()
        if(code === 200) {
          this.addForm.tree = data
          this.addForm.tree.forEach(first => {
            first.subs.forEach(seconed => {
              seconed.subs.forEach(item => {
                if(item.ifHasRight) {
                  this.addForm.permissionKeys.push(item.permissionKey)
                }
              })
            })
          })
          this.dialogAdd=true
        } else {
          this.$message.error(err)
        }
      },
      addTree(formName) {
        this.$refs[formName].validate(valid => {
          if (valid){
            if(this.addForm.permissionKeys.length>0) {
              this.$message.warning('正在创建..')
              api.roleCreate({
                permissionKeys: this.addForm.permissionKeys,
                roleName: this.addForm.roleName
              }).then(res => {
                if(res.code === 200) {
                  this.getData()
                  this.$message.success('创建成功！')
                  this.dialogAdd=false
                }
              })
            } else {
              this.$message.error('请选择至少一项权限')
            }
          }
        })
      },
      handleCheckChangeAdd(data, checked, indeterminate) {
        if(this.addForm.permissionKeys.indexOf(data.permissionKey) !== -1) {
          if(!checked) {
            this.addForm.permissionKeys.splice(this.addForm.permissionKeys.indexOf(data.permissionKey),1)
          }
        } else {
          if(checked) {
            if(data.subs === undefined) {
              this.addForm.permissionKeys.push(data.permissionKey)
            }
          }
        }
      },
      useOpenChange(sign) {
        let status
        if (sign.ifEnable) {
          status = '禁用'
        } else {
          status = '启用'
        }
        this.$confirm('是否'+status+'该角色?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            if(sign.ifEnable) {
              api.roleDisable({ roleId: sign.id }, sign.id).then(res => {
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
            } else {
              api.roleEnable({ roleId: sign.id }, sign.id).then(res => {
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
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'+status
            })
          })
      },
      del(sign) {
        this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          api.roleDelete({ roleId: sign.id }, sign.id).then(res => {
            if(res.code === 200) {
              this.getData()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
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

<style lang="less">
  .el-switch.is-disabled{
    opacity: 1;
  }
</style>

