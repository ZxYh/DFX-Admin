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
                <el-input v-model="form.keyWord" placeholder="手机号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="城市">
                <el-select v-model="form.city" placeholder="选择">
                  <el-option v-for="(c,index) in form.cityList" :key="index" :label="c.name" :value="c.id"></el-option>
                  <el-option label="不限" value=""></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别">
                <el-select v-model="form.sex" placeholder="选择">
                  <el-option label="男" :value="1"></el-option>
                  <el-option label="女" :value="2"></el-option>
                  <el-option label="全部  " :value="null"></el-option>
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
     <el-table-column label="用户" min-width="75" align="center" prop="name"></el-table-column>
      <el-table-column label="头像" min-width="95" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.headImgUrl" class="headImage-small"/>
        </template>
      </el-table-column>
      <el-table-column label="手机号" min-width="125" align="center" prop="phone"></el-table-column>
     <el-table-column label="性别" min-width="55" align="center" prop="sex"></el-table-column>
     <el-table-column label="所在城市" min-width="115" align="center" prop="cityName"></el-table-column>
     <el-table-column label="推荐人" min-width="125" align="center" prop="recommendUser"></el-table-column>
      <el-table-column prop="created_at" label="操作" align="center" fixed="right" >
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row.id)">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="watchDialog" title="用户管理" :visible.sync="dialogTableVisible">
        <div class="dialog-container"><span class="dialog-title">昵称</span><span>{{watchContent.name}}</span></div>
        <div class="dialog-container"><span class="dialog-title">头像</span><span class="dialog-image"><img :src="watchContent.headImgUrl" class="headImage-small"/></span></div>
        <div class="dialog-container"><span class="dialog-title">手机号</span><span>{{watchContent.phone}}</span></div>
        <div class="dialog-container"><span class="dialog-title">性别</span><span>{{watchContent.sex===1?'男':'女'}}</span></div>
        <div class="dialog-container"><span class="dialog-title">所在城市</span><span>{{watchContent.cityName}}</span></div>
        <div class="dialog-container">
          <span class="dialog-title">常用联系人</span>
            <div class="dialog-form">
              <el-table :data="watchContent.contactRspList" border>
                <el-table-column property="name" label="姓名" min-width="60" align="center"></el-table-column>
                <el-table-column property="phone" label="电话" min-width="80" align="center"></el-table-column>
                <el-table-column property="address" label="地址" min-width="120" align="center"></el-table-column>
              </el-table>
            </div>
        </div>
        <div class="dialog-container"><span class="dialog-title">推荐人</span><span>{{watchContent.recommendUser}}</span></div>
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
import city from '@/json/area.json'
export default {
  name: 'user',
  data () {
    return {
      list: [],
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      dialogTableVisible: false,
      filename: '',
      form: {
        city: '',
        sex: null,
        keyWord: '',
        cityList: []
      },
      watchContent: '',
      pageSize: 10,
      pageSizeList: [10, 20, 30, 40],
      currentPage: 1,
      total: 0
    }
  },
  created () {
    this.getData(true)
  },
  methods: {
    async handleDownload () {
      this.listLoading = true
      const res = await api.userExcel({ cityId: this.form.city, sex: this.form.sex, currentPage: this.currentPage, keyWord: this.form.keyWord, pageSize: this.pageSize })
      this.listLoading = false
      if (res.status === 200) {
        const content = res.data
        const blob = new Blob([content])
        const fileName = 'user.xlsx'
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
    async getData (cityUpdate) {
      this.listLoading = true
      const { code, data, err } = await api.userPagination({ cityId: this.form.city, sex: this.form.sex, currentPage: this.currentPage, keyWord: this.form.keyWord, pageSize: this.pageSize })
      this.listLoading = false
      if (code === 200) {
        this.list = data.array
        this.total = parseInt(data.total)
        if (cityUpdate && data.total > 0) {
          api.userPagination({ currentPage: 1, pageSize: data.total }).then(res => {
            let cityArr = []
            res.data.array.forEach((item) => {
              if (item.cityName !== '') {
                cityArr.push(item.cityName)
              }
            })
            Array.prototype.distinct = function () {
              const arr = this
              let result = []
              let i
              let j
              let len = arr.length
              for (i = 0; i < len; i++) {
                for (j = i + 1; j < len; j++) {
                  if (arr[i] === arr[j]) {
                    j = ++i
                  }
                }
                result.push(arr[i])
              }
              return result
            }
            cityArr.distinct().forEach(cityName => {
              city.forEach(areaList => {
                areaList.cityList.forEach(cityId => {
                  if (cityId.areaName === cityName) {
                    this.form.cityList.push({ id: cityId.id, name: cityName })
                  }
                })
              })
            })
            // cityArr.distinct().forEach((item) => {
            //   console.log(item)
            // })
          })
        }
      }
    },
    query () {
      this.currentPage = 1
      this.getData(false)
    },
    async watchFor (id) {
      const { code, data, err } = await api.userDetail({ id: id })
      if (code === 200) {
        this.watchContent = data
        this.dialogTableVisible = true
      } else {
        this.$message.error(err)
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // handleDownload() {
    //   if (this.multipleSelection.length) {
    //     // this.exportExcel ()
    //   } else {
    //     this.$message({
    //       message: '请至少选择一条记录',
    //       type: 'warning'
    //     })
    //   }
    // },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleSizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      this.getData(false)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData(false)
    }
  }
}
</script>

<style scoped>

</style>
