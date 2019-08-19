<template>
  <div class="app-container">
    <div class="search">
      <div class="search-head">
        <!-- <el-button type="default" icon="document" class="search-btn" @click="dialogAssign=true">批量指派</el-button> -->
        <el-button icon="document" class="search-btn" @click="query">查询</el-button>

      </div>
      <div class="search-body">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="输入搜索">
                <el-input v-model="form.orderCode" placeholder="搜索订单号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="输入搜索">
                <el-input v-model="form.phone" placeholder="搜索用户手机号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单状态">
                <el-select v-model="form.status" placeholder="选择">
                  <el-option label="待接单" value="1"></el-option>
                  <el-option label="进行中" value="2"></el-option>
                  <el-option label="完成" value="3"></el-option>
                  <el-option label="取消" value="4"></el-option>
                  <el-option label="不限" value=""></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="废品类型">
               <el-select v-model="form.scrapTypeId" placeholder="选择">
                  <el-option v-for="(i, index) in form.scrapType" :key="index" :label="i.name" :value="i.id"></el-option>
                  <el-option label="不限" value=""></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="输入搜索">
                <el-input v-model="form.area" placeholder="请输入地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="输入搜索">
                <el-input v-model="form.city" placeholder="请输入省市区位置"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属区域">
                 <el-select v-model="form.pointId" placeholder="选择">
                  <el-option v-for="(i, index) in form.point" :key="index" :label="i.name" :value="i.id"></el-option>
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
      <el-table-column label="订单号" min-width="125" align="center" prop="id"> </el-table-column>
      <el-table-column label="回收点" min-width="165" align="center" prop="recyclerPointName"></el-table-column>
      <el-table-column label="预约地址" min-width="215" align="center" prop="address"></el-table-column>
      <el-table-column label="预约时间" min-width="215" align="center" prop="time"></el-table-column>
      <el-table-column label="预计总重（KG）" min-width="135" align="center" prop="weight"></el-table-column>
      <el-table-column label="交易状态" min-width="105" align="center" prop="status"></el-table-column>
      <el-table-column prop="created_at" label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row)">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="watchDialog" title="回收请求管理" :visible.sync="dialogTableVisible">
     <div class="dialog-container"><span class="dialog-title">订单号</span><span>{{watchContent.id}}</span></div>
      <div class="dialog-container"><span class="dialog-title">用户</span><span>{{watchContent.name}}</span></div>
      <div class="dialog-container"><span class="dialog-title">回收点</span><span>{{watchContent.recyclerPointName}}</span></div>
      <div class="dialog-container"><span class="dialog-title">预估总重（kg）</span><span>{{watchContent.weight}}</span></div>
      <div class="dialog-container"><span class="dialog-title">废品类型</span><span v-for="(t, index) in watchContent.scrapTypeNameList" :key="index" class="dialog-image">{{t + ''}}</span></div>
      <!-- <div class="dialog-container"><span class="dialog-title">联系电话</span><span>{{watchContent.phone}}</span></div> -->
      <!-- <div class="dialog-container"><span class="dialog-title">地址</span><span>{{watchContent.address}}</span></div> -->
      <div class="dialog-container"><span class="dialog-title">预约时间</span><span>{{watchContent.time}}</span></div>
      <div class="dialog-container"><span class="dialog-title">订单状态</span><span>{{watchContent.status}}</span></div>
       <div class="dialog-container">
        <span class="dialog-title" style="margin-bottom: 20px">废品图片</span>
       <el-row v-if="watchHasImgList">
          <el-col :span="8" v-for="(i, index) in watchContent.imgList" :key="index" class="text-center dialog-voucher"><img :src="i"></el-col>
        </el-row>
        <span v-else>未填写</span>
      </div>
      <div class="dialog-container">
        <span class="dialog-title">废品备注</span>
         <span class="dialog-remarks" v-if="watchContent.descStr!==''">{{watchContent.descStr}}</span>
        <span v-else>未填写</span>
      </div>
      <div class="dialog-container" v-show="watchContent.status==='完成'">
        <span class="dialog-title">废品详情</span>
        <el-table :data="watchContent.details" show-summary style="margin-top: 10px">
          <el-table-column property="type" label="名称" min-width="120" align="center"></el-table-column>
          <el-table-column property="num" label="数量(公斤)" min-width="120"  align="center"></el-table-column>
          <el-table-column property="price" label="价格(元)" min-width="120" align="center"></el-table-column>

        </el-table>
        <div class="dialog-container"><span class="dialog-title">指派给司机</span> <span v-if="watchContent.driverName!==''">{{watchContent.driverName}}</span><span v-else></span></div>
      </div>
      <div class="dialog-container" v-show="watchContent.status==='进行中'">
        <span class="dialog-title">指派给司机</span>
        <span v-if="watchContent.driverName!==''">{{watchContent.driverName}}</span><span v-else></span>
      </div>
      <div class="text-center dialog-container">
        <el-button type="default" @click="dialogTableVisible=false">返回</el-button>
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
  import api from '@/api/order'
  import apiClass from '@/api/platform'
  import apiPoint from '@/api/recoverypoint'
  export default {
    name: 'appointment',
    data() {
      return {
        list: [],
        driver: [
          { name: '巴啦啦', num: 10 },
          { name: '叽叽叽', num: 5 },
          { name: '嘤嘤嘤', num: 7 },
          { name: '嘻嘻嘻', num: 8 },
          { name: '哈哈哈', num: 4 }
        ],
        listLoading: true,
        multipleSelection: [],
        driverSelection: null,
        downloadLoading: false,
        dialogTableVisible: false,
        dialogAssign: false,
        filename: '',
        form: {
          area: '',
          city: '',
          driverId: '',
          merhantId: '',
          orderCode: '',
          phone: '',
          scrapTypeId: '',
          scrapType: [],
          point: [],
          pointId: '',
          status: ''
        },
        AssignForm: {
          search: ''
        },
        watchContent: '',
        watchHasImgList: true,
        pageSize: 10,
        pageSizeList: [10, 20, 30, 40],
        currentPage: 1,
        total: 0
      }
    },
    created () {
      this.getData()
      this.getClass()
      this.getPoint()
      this.getDriver()
    },
    methods: {
      async getData() {
        this.listLoading = true
        const { code, data, err } = await api.driverOrderPagination({ currentPage: this.currentPage, pageSize: this.pageSize, address: this.form.city + this.form.area ,driverId: this.form.driverId, merhantId: this.form.merhantId, orderCode: this.form.orderCode, phone: this.form.phone, scrapTypeId: this.form.scrapTypeId, status: this.form.status, recyclerPointId: this.form.pointId  })
        this.listLoading = false
        if (code === 200) {
            this.listLoading = false
            this.list = data.array
            this.total = parseInt(data.total)
        }
      },
      async getClass () {
        const { code, data, err } = await apiClass.scrapPagination({ currentPage: 1, pageSize: 10 })
        if (code === 200) {
          apiClass.scrapPagination({ currentPage: 1, pageSize: data.total }).then(res => {
            if(res.code === 200) {
              this.form.scrapType = res.data.array
            }
          })
        }
      },
      async getPoint () {
        const { code, data, err } = await apiPoint.pagination({ currentPage: 1, pageSize: 10 })
        if (code === 200) {
          apiPoint.pagination({ currentPage: 1, pageSize: data.total }).then(res => {
            if(res.code === 200) {
              this.form.point = res.data.array
            }
          })
        }
      },
      async getDriver () {
        const { code, data, err } = await api.driverPagination({ currentPage: 1, pageSize: 10 })
        if (code === 200) {
          api.driverPagination({ currentPage: 1, pageSize: data.total }).then(res => {
            if(res.code === 200) {
              this.driver = res.data.array
            }
          })
        }
      },
       query(formName) {
        this.currentPage = 1
        this.getData()
      },
      async watchFor(sign) {
        const { code, data, err } = await api.driverOrderDetail({ id: sign.id })
        if (code === 200) {
          this.watchContent = data
          if(data.imgList!==undefined) {
            if(data.imgList.length>0){
              this.watchHasImgList = true
            } else {
              this.watchHasImgList = false
            }
          } else {
            this.watchHasImgList = false
          }
          this.dialogTableVisible = true
        } else {
          this.$message.error(err)
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      driverSelectionChange(val) {
        this.driverSelection = val
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


