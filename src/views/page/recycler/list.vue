<template>
  <div class="app-container">
    <div class="search">
      <div class="search-head">
        <el-button icon="document" class="search-btn" @click="query">查询</el-button>

      </div>
      <div class="search-body">
        <el-form label-width="80px">
          <el-row>
            <el-col :span="9">
              <el-form-item label="输入搜索">
                <el-input v-model="keyWord" placeholder="回收商名称/ID/电话/回收人姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="15" class="add-right">
              <el-button type="primary" icon="document" class="search-btn" @click="dialogAdd=true">新建</el-button>
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
      <el-table-column label="回收商名称" min-width="125" align="center" prop="merchantName"></el-table-column>
      <el-table-column label="负责人姓名" min-width="115" align="center" prop="userName"></el-table-column>
      <el-table-column label="联系电话" min-width="125" align="center" prop="phone"></el-table-column>
      <el-table-column label="详细地址" min-width="185" align="center" prop="address"></el-table-column>
      <el-table-column label="当前账户余额(元)" min-width="125" align="center" prop="balance"></el-table-column>
      <el-table-column label="订单总数" min-width="105" align="center" prop="orderCount"></el-table-column>
      <el-table-column label="启用/禁用" min-width="105" align="center">
        <template slot-scope="scope">
          <span @click="useOpenChange(scope.row)">
            <el-switch v-model="scope.row.ifEnable" disabled style="cursor: pointer"></el-switch>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="操作" min-width="155" align="center" fixed="right">
        <template slot-scope="scope">
          <span class="watch" @click="watchFor(scope.row.id)">查看</span>
          <!--<span class="watch" @click="watchFor(scope.row)">编辑</span>-->
          <span class="watch" @click="recharge(scope.row)">充值</span>
          <span class="watch" @click="del(scope.row)">删除</span>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog class="watchDialog" title="新建回收商" :visible.sync="dialogAdd">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px" style="margin-right: 30px">
        <el-form-item label="回收商名称" prop="merchantName">
          <el-input v-model="addForm.merchantName"></el-input>
        </el-form-item>
        <el-form-item label="回收商账号" prop="account">
          <el-input v-model="addForm.account"></el-input>
        </el-form-item>
        <el-form-item label="回收商密码" prop="pwd">
          <el-input v-model="addForm.pwd"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="回收商账户余额">
          0元
        </el-form-item>
        <el-form-item label="选择区域" prop="regionId">
          <el-select v-model="addForm.regionId" @change="ChoseRange" placeholder="区域">
            <el-option  v-for="(p,pIndex) in region" :key="pIndex" :label="p.name" :value="p.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域位置：" v-show="addForm.regionShow">
          {{addForm.regionAddress}}
        </el-form-item>
        <el-form-item>
          <div class="text-center" style="margin-left: -100px">
            <el-button type="primary" @click="submitAdd('addForm')">确认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog class="watchDialog" title="回收点详情" :visible.sync="dialogTableVisible">
      <div class="dialog-container"><span class="dialog-title">回收商账号</span><span>{{watchContent.account}}</span></div>
      <div class="dialog-container"><span class="dialog-title">负责人</span><span>{{watchContent.name}}</span></div>
      <div class="dialog-container"><span class="dialog-title">联系电话</span><span>{{watchContent.phone}}</span></div>
      <div class="dialog-container" ><span class="dialog-title">详细地址</span><span>{{watchContent.address}}</span></div>
      <div class="dialog-container"><span class="dialog-title">回收商账户余额</span><span class="balance">{{watchContent.balance}}</span><span class="watch" @click="recharge(watchContent)">充值</span></div>
      <div class="dialog-container"><span class="dialog-title">经营区域</span><span>{{watchContent.regionName}}</span></div>
      <div class="dialog-container" ><span class="dialog-title">区域位置</span><span>{{watchContent.regionAddress}}</span></div>
      <div class="dialog-container" >
        <span class="dialog-title">状态</span>
        <el-radio-group v-model="watchContent.ifEnable">
          <el-radio :label="true">启用</el-radio>
          <el-radio :label="false">禁用</el-radio>
        </el-radio-group>
      </div>
      <div class="text-center" style="margin-top: 20px">
        <el-button type="primary" :disabled="addDisabled" @click="summitUpDate">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="watchDialog" title="回收商充值" :visible.sync="dialogRecharge">
      <el-form :model="rechargeForm" ref="rechargeForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="充值金额" prop="money"
          :rules="[
            { required: true, message: '充值金额不能为空'},
            { type: 'number', message: '充值金额必须为数字值'}
          ]">
          <el-input v-model.number="rechargeForm.money" placeholder="请输入金额（元）"></el-input>
        </el-form-item>
        <el-form-item :label="`充值凭证（${rechargeForm.imgList.length}/9）`">
          <div class="uploadImg" v-for="(i, index) in rechargeForm.imgList" :key="index" >
            <div class="delModel" @click="delImgList(index)">
              <i class="el-icon-delete"></i>
            </div>
            <img class="avatar" :src="i.url" />
          </div>
          <el-upload
            action=""
            class="avatar-uploader"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="beforeAvatarUpload"
          >
            <el-button icon="el-icon-plus avatar-uploader-icon" plain>添加</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRecharge('rechargeForm')">确定</el-button>
          <el-button type="default" @click="submitCancel('rechargeForm')">取消</el-button>
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
import api from '@/api/recycler'
import apiRegion from '@/api/platform'
import apiRecharge from '@/api/finance'
import validate from '@/utils/tools'
import CosCloud from 'cos-js-sdk-v4'

export default {
  name: 'list',
  data () {
    // var accountValidate = (rule, value, callback) => {
    //   validate.validateAccount(value, callback)
    // }
    var pwdValidate = (rule, value, callback) => {
      validate.validatePwd(value, callback)
    }
    var phoneValidate = (rule, value, callback) => {
      validate.validatePhone(value, callback)
    }
    return {
      list: [],
      keyWord: '',
      inited: false,
      uploadParams: '',
      uploadList: [],
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      dialogAdd: false,
      dialogTableVisible: false,
      dialogEdit: false,
      dialogRecharge: false,
      dialogUpdatePic: false,
      dialogImageUrl: '',
      addDisabled: false,
      filename: '',
      region: [],
      addForm: {
        account: '',
        pwd: '',
        name: '',
        phone: '',
        address: '',
        merchantName: '',
        regionId: '',
        regionAddress: '',
        regionShow: false
      },
      rules: {
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
          // { validator: accountValidate, trigger: 'blur' }
        ],
        pwd: [
          { required: true, validator: pwdValidate, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: phoneValidate, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        merchantName: [
          { required: true, message: '请输入回收商名称', trigger: 'blur' }
        ],
        regionId: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ]
      },
      rechargeForm: {
        money: '',
        imgList: [],
        account: '',
        imgListTest: {
          name: '',
          key: '',
          url: ''
        }
      },
      watchContent: '',
      updateId: '',
      pageSize: 10,
      pageSizeList: [10, 20, 30, 40],
      currentPage: 1,
      total: 0
    }
  },
  created () {
    this.initCOS()
    this.getData()
    this.getRegionId()
  },
  methods: {
    async getData () {
      this.listLoading = true
      const { code, data } = await api.pagination({ currentPage: this.currentPage, keyWord: this.keyWord, pageSize: this.pageSize })
      this.listLoading = false
      if (code === 200) {
        this.listLoading = false
        this.list = data.array
        this.total = parseInt(data.total)
      }
    },
    async getRegionId () {
      const that = this
      const { code, data } = await apiRegion.regionPagination()
      if (code === 200) {
        apiRegion.regionPagination({ currentPage: 1, pageSize: data.total }).then(res => {
          if (res.code === 200) {
            that.region = res.data.array
          }
        })
      }
    },
    query () {
      this.currentPage = 1
      this.getData()
    },
    async initCOS () {
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
      if (this.rechargeForm.imgList.length === 9) {
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
      this.cos.uploadFile(this.handleSuccess, this.handleError, progressCallBack, this.uploadParams.bucket, _filename, file, 0, (id) => {
        this.rechargeForm.imgListTest = {
          name: file.name,
          key: _key,
          url: this.uploadParams.host + _key + '?sign=' + this.uploadParams.uploadSign
        }
      })
      return false
    },
    handleSuccess (res, file) {
      this.rechargeForm.imgList.push(this.rechargeForm.imgListTest)
    },
    handleError (res, file) {
      console.log(file)
      this.$message.error('上传失败，请重新选择！')
    },
    delImgList (index) {
      this.rechargeForm.imgList.splice(index, 1)
    },
    useOpenChange (sign) {
      let title, message
      if (sign.ifEnable) {
        title = '是否禁用当前回收商?'
        message = '已禁用'
      } else {
        title = '是否启用当前回收商?'
        message = '启用成功'
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        api.changeStatus({ status: !sign.ifEnable, id: sign.id }).then(res => {
          if (res.code === 200) {
            sign.ifEnable = !sign.ifEnable
            this.$message({
              type: 'success',
              message: message
            })
          } else {
            this.$message.error(res.err)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    ChoseRange (e) {
      this.addForm.regionShow = true
      let address = this.region.filter(item => {
        return e === item.id
      })[0]
      let area = ''
      address.districtNameList.forEach(item => {
        area += '-' + item
      })
      this.addForm.regionAddress = `${address.provinceName} ${address.cityName} ${area}`
    },
    submitAdd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addDisabled = true
          api.add({
            account: this.addForm.account,
            address: this.addForm.address,
            merchantName: this.addForm.merchantName,
            name: this.addForm.name,
            phone: parseInt(this.addForm.phone),
            pwd: this.addForm.pwd,
            regionId: this.addForm.regionId
          }).then(res => {
            this.addDisabled = false
            if (res.code === 200) {
              this.dialogAdd = false
              this.$message({ message: '创建成功', type: 'success' })
              this.getData()
            } else {
              this.$message.error(res.err)
            }
          })
        }
      })
    },
    async watchFor (id) {
      this.updateId = id
      const { code, data, err } = await api.detail({ id: id })
      if (code === 200) {
        this.dialogTableVisible = true
        this.watchContent = data
        let area = ''
        data.districtNameList.forEach(item => {
          area += '-' + item
        })
        this.watchContent.regionAddress = `${data.provinceName} ${data.cityName} ${area}`
      } else {
        this.$message.error(err)
      }
    },
    async summitUpDate () {
      const { code } = await api.changeStatus({ id: this.updateId, status: this.watchContent.ifEnable })
      if (code === 200) {
        this.dialogTableVisible = false
        this.getData()
      }
    },
    recharge (sign) {
      this.rechargeForm.account = sign.account
      this.dialogRecharge = true
    },
    hashFileName (filename) {
      return Math.random().toString(36).substr(2, 9) + '.' + (/[^.]+$/.exec(filename) || '')
    },
    submitRecharge (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.rechargeForm.imgList.length > 0) {
            let imgList = []
            this.rechargeForm.imgList.forEach(item => {
              imgList.push(item.key)
            })
            apiRecharge.rechargeAdd({
              account: this.rechargeForm.account,
              imgList: imgList,
              money: this.rechargeForm.money
            }).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '充值成功'
                })
                this.submitCancel(formName)
                this.dialogTableVisible = false
                this.getData()
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
    submitCancel (formName) {
      this.$refs[formName].resetFields()
      this.rechargeForm.imgList = []
      this.dialogRecharge = false
    },
    del (sign) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.list.forEach((eve, index) => {
          if (eve.sign === sign.sign) {
            this.list.splice(index, 1)
            this.getData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitForm () {
      console.log(this.Jurisdiction)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
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
  },
  watch: {
    dialogAdd (val, oldval) {
      if (this.$refs['addForm'] !== undefined) {
        this.$refs['addForm'].resetFields()
      }
    }
  }
}
</script>

<style scoped lang="less">
  .balance {
    margin-right: 30px;
    font-weight: bold;
    font-size: 16px;
  }
  .el-switch.is-disabled {
    opacity: 1;
  }
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
