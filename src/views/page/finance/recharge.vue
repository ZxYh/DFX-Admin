<template>
  <div class="app-container">
    <div class="search">
      <div class="search-head">
        <el-button icon="document" class="search-btn" @click="query">查询</el-button>
      </div>
      <div class="search-body">
        <el-form ref="form" :model="form" label-width="100px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="输入搜索">
                <el-input v-model="form.name" placeholder="提现人名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="输入手机号">
                <el-input v-model="form.phone" placeholder="充值人手机号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="add-right">
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

      <el-table-column label="账号" min-width="105" align="center" prop="account"></el-table-column>
      <el-table-column label="充值人" min-width="105" align="center" prop="name"></el-table-column>
      <el-table-column label="手机号" min-width="105" align="center" prop="phone"></el-table-column>
      <el-table-column label="充值金额（元）" min-width="125" align="center" prop="money"></el-table-column>
      <el-table-column label="充值凭证" min-width="105" align="center">
        <template slot-scope="scope">
          <img v-show="index===0" v-for="(i, index) in scope.row.imgList" :key="index" class="headImage-small" :src="i"/>
        </template>
      </el-table-column>
      <el-table-column label="充值时间" min-width="185" align="center" prop="createdAt"></el-table-column>
      <el-table-column prop="created_at" label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row)">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="watchDialog" title="充值记录" :visible.sync="dialogTableVisible">
      <div class="dialog-container"><span class="dialog-title">账号</span><span>{{watchContent.account}}</span></div>
      <div class="dialog-container"><span class="dialog-title">充值人</span><span>{{watchContent.recyclerMerchantName}}</span></div>
      <div class="dialog-container"><span class="dialog-title">充值金额（元）</span><span>{{watchContent.money}}</span></div>
      <div class="dialog-container"><span class="dialog-title">手机号</span><span>{{watchContent.phone}}</span></div>
      <div class="dialog-container"><span class="dialog-title">充值时间</span><span>{{watchContent.rechargerTime}}</span></div>
      <div class="dialog-container">
        <span class="dialog-title">充值凭证（{{watchContent.imgListLength}}/9）</span>
        <el-row>
          <el-col :span="8" v-for="(i, index) in watchContent.imgList" :key="index" class="dialog-container text-center dialog-voucher"><img :src="i"></el-col>
        </el-row>
      </div>
      <div class="dialog-container text-center">
        <el-button @click="dialogTableVisible=false">确定</el-button>
      </div>
    </el-dialog> 
    <el-dialog class="watchDialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" title="新建充值" :visible.sync="dialogAdd">
      <el-form ref="addForm" :rules="addRules" :model="addForm" label-width="120px" style="margin-right: 30px">
        <el-form-item label="账户" prop="account">
          <el-select v-model="addForm.account" placeholder="请选择账户" @change="chooseAccount">
            <el-option v-for="(i, index) in addForm.accountList" :key="index" :label="i.account" :value="i.account"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值人：">
            管理员
        </el-form-item>
        <el-form-item label="金额（元）" prop="money">
          <el-input v-model.number="addForm.money"></el-input>
        </el-form-item>
        <el-form-item :label="`充值凭证（${addForm.imgList.length}/9）`">
          <div class="uploadImg" v-for="(i, index) in addForm.imgList" :key="index" >
            <div class="delModel" @click="delImgList(index)">
              <i class="el-icon-delete"></i>
            </div>
            <img class="avatar" :src="i.url" />
          </div>
          <el-upload
            class="avatar-uploader"
            action=""
            :on-error="upLoadError"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <el-button icon="el-icon-plus avatar-uploader-icon" plain>添加</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAdd('addForm')">确认创建</el-button>
          <el-button type="default" @click="submitCancel('addForm')">取消</el-button>
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
import api from '@/api/finance'
import apiRecycler from '@/api/recycler'
import rule from '@/utils/tools'
import CosCloud from 'cos-js-sdk-v4'
import apiRegion from '@/api/platform'
import apiAdmin from '@/api/role'
export default {
  name: 'recharge',
  data () {
    var checkNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('金额不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          callback()
        }
      }, 100)
    }
    var phoneValidate = (rule, value, callback) => {
      validate.validatePhone(value, callback)
    }
    return {
      list: [],
      inited: false,
      cos: null,
      uploadParams: '',
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      dialogTableVisible: false,
      dialogAdd: false,
      dialogUpdatePic: false,
      dialogImageUrl: '',
      filename: '',
      form: {
        name: '',
        phone: '',
        viewDeatilList: ''
      },
      editForm: {
        title: '',
        type: '',
        address: ''
      },
      addForm: {
        adminList: '',
        account: '',
        imgList: [],
        money: '',
        imgListTest: {
          name: '',
          key: '',
          url: ''
        }
      },
      addRules: {
        account: [
          { required: true, message: '请选择账户', trigger: 'change' }
        ],
        money: [
          { required: true, validator: checkNum, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: phoneValidate, trigger: 'blur' }
        ]
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
    this.getRecyclerData()
    this.initCOS()
  },
  methods: {
    async getData () {
       this.listLoading = true
      const { code, data, err } = await api.rechargePagination({ currentPage: this.currentPage, name: this.form.name, pageSize: this.pageSize, phone: this.form.phone })
      if (code === 200) {
        this.listLoading = false
        this.list = data.array
        this.total = parseInt(data.total)
      } else {
        this.$message.error(err)
      }
    },
    async getRecyclerData () {
      let pageSize = 10
      const { code, data, err } = await apiRecycler.pagination({ currentPage: 1, pageSize: pageSize })
      if (code === 200) {
        pageSize = data.total
        apiRecycler.pagination({ currentPage: 1, pageSize: pageSize }).then(res => {
          if (res.code === 200) {
            this.addForm.accountList = res.data.array
          }
        })
      }
    },
     async initCOS() {
      const { code, data, err } = await apiRegion.getPrivateToken()
      if (code === 200) {
        this.uploadParams = data
      } else {
        this.$message.error(err)
        if (code === 506) {
          localStorage.removeItem('token')
          localStorage.removeItem('isLogin')
          localStorage.removeItem('username')
          // this.$router.replace('/')
        }
      }
      this.cos = new CosCloud({
        appid: this.uploadParams.appId, // APPID 必填参数
        bucket: this.uploadParams.bucket + this.uploadParams.keyPrefix,
        region: this.uploadParams.region,
        getAppSign: (callback) => { // 获取签名 必填参数
          callback(this.uploadParams.uploadSign)
        },
        getAppSignOnce: (callback) => { // 单次签名，必填参数，参考上面的注释即可
          callback(this.uploadParams.uploadSign)
        }
      })
      this.inited = true
    },
    beforeAvatarUpload (file) {
      // 上传校验
      if (!this.inited) {
        this.$message({ message: '组件初始化未完成！', type: 'warning' })
        return false
      }
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      } 
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      } 
      if (this.addForm.imgList.length === 9) {
        this.$message({
          message: '图片上传已达上限',
          type: 'warning'
        })
        return false
      }
      let _filename = this.hashFileName(file.name)
      let _key = this.uploadParams.keyPrefix + _filename
      const progressCallBack = (respond) => {
        return respond
      }
      this.cos.uploadFile(this.handleAvatarSuccess, this.upLoadError, progressCallBack, this.uploadParams.bucket, _filename, file, 0, (id) => {
        this.addForm.imgListTest = {
          name: file.name,
          key: _key,
          url: this.uploadParams.host + _key + '?sign=' + this.uploadParams.uploadSign
        }
      })
      return false
    },
    delImgList (index) {
      this.addForm.imgList.splice(index, 1)
    },
    hashFileName(filename) {
      return Math.random().toString(36).substr(2, 9) + '.' + (/[^.]+$/.exec(filename) || '')
    },
    handleAvatarSuccess(res, file) {
      this.addForm.imgList.push(this.addForm.imgListTest)
    },
    handleFalse (files,fileList){
      this.$message({
        message: '图片上传已达上限',
        type: 'warning'
      })
    },
    upLoadError (res, file) {
      this.$message.error('上传失败，请重新选择！')
    },
    query () {
      this.currentPage = 1
      this.getData()
    },
    async watchFor (sign) {
      const { code, data, err } = await api.rechargeDetail({ id: sign.id })
      if (code === 200) {
        this.watchContent = data
        this.watchContent.imgListLength = data.imgList.length
        this.dialogTableVisible = true
      } else {
        this.$message.error(err)
      }
    },
    chooseAccount (e) {

    },
    submitAdd (formName) {
      this.$refs[formName].validate(valid => {
        if (valid){
          if (this.addForm.imgList.length > 0) {
            let imgList = []
            this.addForm.imgList.forEach(item => {
              imgList.push(item.key)
            })
            api.rechargeAdd({
              account: this.addForm.account,
              imgList: imgList,
              money: this.addForm.money
            }).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '充值成功'
                })
                this.getData()
                this.submitCancel(formName)
              } else {
                this.$message.error(res.err)
              }
            })
          } else {
            this.$message({
              message: '请上传凭证图片',
              type: 'warning'
            })
          }
        }
      })
    },
    submitCancel(formName) {
      this.$refs[formName].resetFields()
      this.addForm.imgList = []
      this.dialogAdd=false
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
  .avatar{
    width: 100%;
    max-width: 200px;
  }
  .uploadImg{
    display: inline-block;
    margin: 10px;
    border: 2px solid #DCDFE6;
    overflow: hidden;
    position: relative;
    line-height: 0;
  }
  .delModel{
    position: absolute;
    right: -15px;
    top: -15px;
    background: #fff;
    width: 40px;
    height: 40px;
    line-height: 50px;
    border-radius: 50%;
  }
  .delModel:hover{
    background: #DCDFE6;
    cursor: pointer;
    transition: 0.5s;
  }
  .el-icon-delete{
    margin-left: 10px;
  }
</style>