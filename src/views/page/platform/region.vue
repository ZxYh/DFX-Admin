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
                <el-input v-model="keyWord" placeholder="区域名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="17" class="add-right">
              <el-button type="default" icon="document" class="search-btn" @click="addOpen('largeForm')">新增区域</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" fit highlight-current-row @selection-change="handleSelectionChange"
              style="width: 100%"
              ref="multipleTable">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column align="center" label='废品分类编号' min-width="185">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="区域名称" min-width="185" align="center">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="区域位置" min-width="215" align="center">
        <template slot-scope="scope">
          {{scope.row.provinceName}}、{{scope.row.cityName}}、
          <span v-for="(dis, index) in scope.row.districtNameList" :key="index">{{`${dis} `}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="185" align="center">
        <template slot-scope="scope">
          {{scope.row.createdAt}}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="操作" min-width="95" align="center" fixed="right">
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row.id,scope.row.name,'largeForm')">编辑</span>
          <span class="watch" @click="del(scope.row.id)">删除</span>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog  :visible.sync="dialogLarge" min-width="80%" title="新建" class="watchDialog">
      <el-form ref="largeForm" :rules="rules" :model="largeForm" label-width="80px">
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="largeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="区域位置" required>
          <el-row style="margin-bottom: 20px">
            <el-col :span="12">
              <el-form-item prop="province">
                <el-select  v-model="largeForm.province" @change="ChoseProvince" placeholder="省" class="city-select">
                  <el-option v-for="p in largeForm.provinceList" :key="p.id" :label="p.areaName" :value="p.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="city">
                <el-select v-model="largeForm.city" @change="ChoseCity" placeholder="市" class="city-select">
                  <el-option v-for="c in largeForm.cityList" :key="c.id" :label="c.areaName" :value="c.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-dropdown :hide-on-click="false" trigger="click">
            <div>
              <el-button type="default" v-if="largeForm.regionIdArr.length>0" >
                    <span class="clampText">
                        <span v-for="(a, index) in largeForm.regionIdArr" :key="index">{{`${a.areaName} `}}</span>
                    </span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-button type="default" v-else>
                请选择区(县)<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>

              <el-button type="text">添加</el-button>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-checkbox-group v-model="largeForm.regionIdArr" @change="ChooseBlock">
                <el-dropdown-item v-for="b in largeForm.blockList" :key="b.id" ><el-checkbox :label="b">{{b.areaName}}</el-checkbox></el-dropdown-item>
              </el-checkbox-group>
            </el-dropdown-menu>

          </el-dropdown>
          <div class="regionTag">
            <el-tag v-for="tag in largeForm.regionIdArr" :key="tag.id" closable class="tags" @close="handleCloseAdd(tag)">{{tag.areaName}}</el-tag>
          </div>
          <div class="el-form-item__error" v-show="largeForm.hasRegion">至少选择一个区域</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="addDisabled" @click="submitAdd('largeForm')">立即创建</el-button>
          <el-button @click="dialogLarge = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog  :visible.sync="dialogDetails" min-width="80%" title="编辑" class="watchDialog">
      <el-form ref="largeForm" :rules="rules" :model="largeForm" label-width="80px">
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="largeForm.name" :placeholder="watchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="区域位置" required>
          <el-row style="margin-bottom: 20px">
            <el-col :span="12">
              <el-form-item prop="province">
                <el-select  v-model="largeForm.province" @change="ChoseProvince" :placeholder="watchForm.proviceName" class="city-select">
                  <el-option v-for="p in largeForm.provinceList" :key="p.id" :label="p.areaName" :value="p.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="city">
                <el-select v-model="largeForm.city" @change="ChoseCity" :placeholder="watchForm.cityName" class="city-select">
                  <el-option v-for="c in largeForm.cityList" :key="c.id" :label="c.areaName" :value="c.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-dropdown :hide-on-click="false" trigger="click">
            <div>
              <el-button type="default" v-if="largeForm.regionIdArr.length>0" >
                    <span class="clampText">
                        <span v-for="(a, index) in largeForm.regionIdArr" :key="index">{{`${a.areaName} `}}</span>
                    </span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-button type="default" v-else>
                请选择区(县)<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>

              <el-button type="text">添加</el-button>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-checkbox-group v-model="largeForm.regionIdArr" @change="ChooseBlock">
                <el-dropdown-item v-for="b in largeForm.blockList" :key="b.id" ><el-checkbox :label="b">{{b.areaName}}</el-checkbox></el-dropdown-item>
              </el-checkbox-group>
            </el-dropdown-menu>

          </el-dropdown>
          <div class="regionTag">
            <el-tag v-for="tag in largeForm.regionIdArr" :key="tag.id" closable class="tags">{{tag.areaName}}</el-tag>
          </div>
          <div class="el-form-item__error" v-show="largeForm.hasRegion">至少选择一个区域</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpdate('largeForm')">确认修改</el-button>
          <el-button @click="dialogDetails = false">取消</el-button>
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
  import cityData from '@/json/area.json'
  import api from '@/api/platform'
  export default {
    name: 'region',
    props: ['aaa'],
    data() {
      return {
        dialogLarge: false,
        dialogDetails: false,
        addDisabled: false,
        list: [],
        listLoading: true,
        multipleSelection: [],
        downloadLoading: false,
        filename: '',
        watchForm: {},
        largeForm: {
          name: '',
          province: '',
          provinceList: [],
          city: '',
          cityList: [],
          blockList: [],
          regionIdArr: [],
          hasRegion: false,
        },
        rules:{
          name:[
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          province: [
            { required: true, message: '请选择省级地区', trigger: 'change' }
          ],
          city: [
            { required: true, message: '请选择市级地区', trigger: 'change' }
          ],
          block: [
            { type: 'array', required: true, message: '至少选择一个区域', trigger: 'change' }
          ],
        },
        updateId: '',
        keyWord: '',
        pageSize: 10,
        pageSizeList: [10, 20, 30, 40],
        currentPage: 1,
        total: 0
      }
    },
    created() {
      this.getData()

    },
    mounted() {},
    methods: {
      async getData() {
        this.largeForm.provinceList = cityData
        const { code, data, err } = await api.regionPagination({currentPage: this.currentPage, keyWord: this.keyWord, pageSize: this.pageSize})
        if (code === 200) {
          this.listLoading = false
          this.list = data.array
          this.total = parseInt(data.total)

        }
      },
      myResetFields(formName){
        if (this.$refs[formName]!==undefined) {
          this.$refs[formName].resetFields();
        }
      },
      addOpen(formName){
        this.dialogLarge=true
        this.myResetFields(formName)
        this.largeForm.regionIdArr = []
      },
      ChoseProvince(e) {
        const city = this.largeForm.provinceList.filter(province => e === province.id)
        this.largeForm.cityList = city[0].cityList
        this.largeForm.regionIdArr = []
        this.largeForm.city = ''
      },
      ChoseCity(e) {
        const block = this.largeForm.cityList.filter(city => e === city.id)
        this.largeForm.blockList = block[0].cityList
        this.largeForm.regionIdArr = []
      },
      ChooseBlock(){
        const that = this
        if (this.largeForm.regionIdArr.length>0){
          this.largeForm.hasRegion = false
        } else {
          setTimeout(()=>{
            that.largeForm.hasRegion = true
          },200)

        }
      },
      handleCloseAdd(tag){
        this.largeForm.regionIdArr.splice(tag,1)
      },
      submitAdd(formName) {
        const that = this
        this.$refs[formName].validate((valid) => {
          if (valid&&this.largeForm.regionIdArr.length>0) {
            let arr = []
            that.largeForm.regionIdArr.forEach((eve) => {
              arr.push(eve.id)
            })
            that.addDisabled = true
            api.regionAdd({
              name: that.largeForm.name,
              provicneId: that.largeForm.province,
              cityId: that.largeForm.city,
              regionIdArr: arr
            }).then((res) => {
              that.addDisabled = false
              if (res.code === 200) {
                that.dialogLarge = false
                this.$message.success('创建成功')
                that.getData()
              }else {
                this.$message.error(res.err)
              }
            })

          } else if (this.largeForm.regionIdArr.length===0) {
            this.largeForm.hasRegion = true
          }
        })
      },
      del(id) {
        console.log(id)
        this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          api.regionDelete({id: id}).then((res) => {
            if (res.code === 200) {
              console.log(res)
              this.list.forEach((eve, index) => {
                if (eve.id === id) {
                  this.list.splice(index, 1)
                  this.$message({type: 'success', message: '删除成功!'})
                }
              })
            }
          })

        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'})
        })
      },
      query() {
        this.currentPage = 1
        this.getData()
      },
      async watchFor(id,name,formName) {
        this.myResetFields(formName)
        this.updateId = id
        this.largeForm.regionIdArr = []
        const { code, data, err } = await api.regionDetail({id: id})
        if (code === 200) {
          this.watchForm = data
          this.dialogDetails = true
        }
        this.watchForm.name = name
      },
      submitUpdate(formName){
        const that = this
        this.$refs[formName].validate((valid) => {
          if (valid&&this.largeForm.regionIdArr.length>0) {
            let arr = []
            that.largeForm.regionIdArr.forEach((eve) => {
              arr.push(parseInt(eve.id))
            })
            api.regionUpdate({
              name: that.largeForm.name,
              provicneId: parseInt(that.largeForm.province),
              cityId: parseInt(that.largeForm.city),
              districtIdArr: arr,
              id: parseInt(that.updateId)
            }).then(res => {
              if (res.code === 200) {
                that.dialogDetails = false
                that.getData()
              }else{
                if (res.err !== undefined) {
                  this.$message.error(res.err) 
                } else {
                  console.log(res)
                  this.$message.error('系统错误，请稍后再试')
                }
              }
            })

          } else if (this.largeForm.regionIdArr.length===0) {
            this.largeForm.hasRegion = true
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
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

<style lang="less" scoped>
  .el-switch.is-disabled{
    opacity: 1;
  }
  .city-select{
    margin-right: 10px;
  }
</style>
