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
                <el-input v-model="form.keyWord" placeholder="回收点名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商圈类别">
                <el-select v-model="form.businessDistrictName" placeholder="选择">
                  <el-option v-for="(i, index) in form.businessDistrictList" :key="index" :label="i.name" :value="i.name"></el-option>
                  <el-option label="不限" value=""></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" class="add-right">
              <!-- <el-button type="default" icon="document" class="search-btn" @click="dialogAdd=true">新建</el-button> -->
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
      <el-table-column label="回收点名称" min-width="125" align="center" prop="name"></el-table-column>
      <el-table-column label="商圈类别" min-width="105" align="center" prop="businessDistrictName"></el-table-column>
      <el-table-column label="运营状态" min-width="105" align="center">
        <template slot-scope="scope">
            {{scope.row.ifEnable ? '运营中' : '停止运营'}}
        </template>
      </el-table-column>
      <el-table-column label="所在区域" min-width="185" align="center" prop="address"></el-table-column>
      <el-table-column prop="created_at" label="操作" width="115" fixed="right" align="center" >
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row)">查看</span>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog class="watchDialog" title="回收点信息" :visible.sync="dialogTableVisible">
      <div class="dialog-container"><span class="dialog-title">回收点名称</span><span>{{watchContent.name}}</span></div>
      <div class="dialog-container"><span class="dialog-title">商圈类别</span><span>{{watchContent.businessType}}</span></div>
      <div class="dialog-container">
          <span class="dialog-title">回收点图片</span>
          <img :src="watchContent.img" style="max-width:200px;vertical-align: top;">
      </div>
      <div class="dialog-container"><span class="dialog-title">运营状态</span><span>{{watchContent.ifEnable ? '运营中' : '停止运营'}}</span></div>
      <div class="dialog-container"><span class="dialog-title">所在区域</span><span>{{watchContent.address}}</span></div>
       <div class="amap-wrapper">
            <el-amap class="amap-box" :vid="'amap-vue'" :zoom="editForm.zoom" :center="editForm.center" >
              <el-amap-polygon v-for="(polygon, index) in editForm.polygons" :key="index" :vid="index" :ref="`polygon_${index}`" :path="polygon.path" :fill-color="polygon.fillColor" :strokeColor="polygon.strokeColor" :fill-opacity="0.3"></el-amap-polygon>
              <el-amap-text
                :position="editForm.currentWindow.position"
                :text="editForm.currentWindow.content">
              </el-amap-text>
        </el-amap>
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
  import api from '@/api/recoverypoint'
  import apiBusinesst from '@/api/platform'
  
  export default {
    name: 'list',
    data () {
      return {
        list: [],
        listLoading: true,
        multipleSelection: [],
        uploadParams: '',
        downloadLoading: false,
        dialogTableVisible: false,
        filename: '',
        form: {
          keyWord: '',
          businessDistrictName: '',
          businessDistrictList: []
        },
        editForm: {
            name: '',
            businessDistrictType: '',
            address: '',
            desc: '',
            status: '',
            zoom: 18,
            center: [],
            polygons: [],
            editPolygonsIndex: '',
            defaultEditPoint: '',
            pointEdit: false,
            updatePointList: [],
            currentWindow: {}
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
      this.getBusinesst()
    },
    methods: {
      async getData() {
        this.listLoading = true
        const { code, data, err } = await api.pagination({ currentPage: this.currentPage, keyWord: this.form.keyWord, pageSize: this.pageSize, businessDistrictName: this.form.businessDistrictName })
        this.listLoading = false
        if (code === 200) {
          this.listLoading = false
          this.list = data.array
          this.total = parseInt(data.total)
        }
      },
      async getBusinesst() {
          const { code, data, err } = await apiBusinesst.businessPagination({ currentPage: 1, pageSize: 10 })
          if(code === 200) {
              apiBusinesst.businessPagination({ currentPage:1, pageSize: data.total }).then(res => {
                this.form.businessDistrictList = res.data.array
              })
          }
      },
      query() {
        this.currentPage = 1
        this.getData()
      },
      async watchFor(sign, formName) {
        const { code, data, err } = await api.pointDetail({ id: sign.id })
        if (code === 200) {
            this.editForm = {
              name: '',
              businessDistrictType: '',
              address: '',
              desc: '',
              status: '',
              zoom: 18,
              center: [],
              polygons: [],
              editPolygonsIndex: '',
              defaultEditPoint: '',
              pointEdit: false,
              updatePointList: [],
              currentWindow: {}
            }
            let editable = false
            this.watchContent = data
            this.watchContent.ifEnable = sign.ifEnable
            let fillColor = '#FDE1A9'
            if(data.pointBeanList.length > 0) {
                data.pointBeanList.forEach((item, index) => {
                    let pointList = []
                    if(item.ifCurrent) {
                        this.editForm.defaultEditPoint = index
                        this.editForm.center = [item.pointList[0].longitude, item.pointList[0].latitude]          
                        this.editForm.updatePointList = item.pointList
                        this.editForm.currentWindow = {
                          position:  this.editForm.center,
                          content: sign.name
                        }

                        fillColor = '#FF4F3E'
                    } 
                    item.pointList.forEach(point => {
                        pointList.push([point.longitude, point.latitude])
                    })
                    // 添加显示区域
                    this.editForm.polygons.push({
                        editable: false,
                        strokeColor: '#114F92',
                        fillColor: fillColor,
                        path: pointList,
                        events: {
                            end: (type) => {
                                if(this.editForm.pointEdit) {
                                    let pointList = []
                                    type.target.Uh.path.forEach(item => {
                                        pointList.push({ latitude: item.lat, longitude: item.lng })
                                    })
                                    // this.editForm.updatePointList[this.editForm.editPolygonsIndex] = pointList
                                    this.editForm.updatePointList = pointList
                                }
                                this.editForm.pointEdit = false
                            }
                        }
                    })
                    // 添加修改时默认的回收点
                    this.editForm.updatePointList.push(item.pointList)
                })
            }
            this.dialogTableVisible = true

            // this.editForm.center = [this.watchContent.pointBeanList[0].topLeftPoint.longitude, this.watchContent.pointBeanList[0].topLeftPoint.latitude]
            // if(this.watchContent.pointBeanList.length > 0) {
            //     this.watchContent.pointBeanList.forEach(item => {
            //         this.editForm.polygons.push({
            //             editable: false,
            //             strokeColor: '#114F92',
            //             path: [[item.topLeftPoint.longitude, item.topLeftPoint.latitude], [item.topRightPoint.longitude, item.topRightPoint.latitude], [item.underRightPoint.longitude, item.underRightPoint.latitude], [item.underLeftPoint.longitude, item.underLeftPoint.latitude]]
            //         })
            //     })
            // }
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleSizeChange(val) {
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
    .amap-wrapper {
        width: 100%;
        height: 20vw;
        min-height: 200px;
    }
    .label-point{
        margin-bottom: 22px
    }
    .editButton{
        margin: 10px 10px 0 0;
    }
     .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    border: #8c939d 1px dashed;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }
  .avatar {
    width: 178px;
    display: block;
  }
</style>
