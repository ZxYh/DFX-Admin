
<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="请选择轮播图：">
        <el-select v-model="form.type" placeholder="请选择" @change="getData">
          <el-option label="用户端" :value="1"></el-option>
          <el-option label="回收者端" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Banner：">
        <el-table :data="form.viewDeatilList" v-loading.body="listLoading" element-loading-text="拼命加载中" border style="width: 100%">
          <el-table-column prop="date" label="图片" align="center">
            <template slot-scope="scope">
              <img v-if="scope.row.noUpload" :src="scope.row.url" class="avatar">
              <el-upload
                v-else
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-error="upLoadError"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="scope.row.url" :src="scope.row.url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" @click="handleAvatarIndex(scope.$index)"></i>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column label="链接" align="center">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.noUpload" class="item" effect="dark" content="点击复制" placement="top">
                <el-input v-clipboard:copy="scope.row.url" v-clipboard:success="onCopy" v-clipboard:error="onError" :disabled="true" placeholder="https://" v-model="scope.row.url"></el-input>
              </el-tooltip>
              <el-input v-else placeholder="https://" v-model="scope.row.url"></el-input> 
            </template>
          </el-table-column>
          <el-table-column label="文字描述" align="center">
            <template slot-scope="scope">
               <el-tooltip v-if="scope.row.noUpload" class="item" effect="dark" content="点击复制" placement="top">
                <el-input v-clipboard:copy="scope.row.msgDesc" v-clipboard:success="onCopy" v-clipboard:error="onError" :disabled="true" v-model="scope.row.msgDesc"></el-input>
              </el-tooltip>
              <el-input v-else type="textarea" v-model="scope.row.msgDesc"></el-input> 
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" align="center">
            <template slot-scope="scope">
              <el-button type="text" :disabled="scope.row.noUpload" @click="submitKeep(scope.row)">保存</el-button>
              <el-button type="text" @click="del(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button @click="add">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import CosCloud from 'cos-js-sdk-v4'
    import api from '@/api/platform'
    export default {
      name: 'carousel',
      data() {
        return {
          listLoading: true,
          form: {
            type: 1,
            viewDeatilList: [],
            index: ''
          },
          uploadParams: '',
          inited: false,
          cos: null,
          inited: false,
          uploadList: [],
          imageUrl: ''
        }
      },
      created() {
        this.getData()
        this.initCOS()
      },
      methods: {
        async getData() {
          this.listLoading = true
          const { code, data, err } = await api.viewList({ type: this.form.type })
          this.listLoading = false
          if (code === 200) {
            data.map(item => {
              item.noUpload = true
            })
            this.form.viewDeatilList = data
          }
        },
        async initCOS() {
          const { code, data, err } = await api.getPublicToken()
          if (code === 200) {
            this.uploadParams = data
          } else {
            this.$message.error(err)
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
        handleAvatarIndex(index) {
          this.form.index = index
        },
        beforeAvatarUpload(file) {
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
          let _filename = this.hashFileName(file.name)
          let _key = this.uploadParams.keyPrefix + _filename
          const progressCallBack = (respond) => {
            this.form.viewDeatilList.map((item) => {
              if (item.imgKey === _key) {
                item.url = this.uploadParams.host+_key
              }
            })
          }
          this.$notify.info({
            title: '消息',
            message: '正在加载',
            duration: 1200,
            showClose: false
          });
          this.cos.uploadFile(this.handleAvatarSuccess, this.upLoadError, progressCallBack, this.uploadParams.bucket, _filename, file, 0)
          this.imageUrl = this.uploadParams.host+_key
          this.key = _key
          return false
        },
        handleAvatarSuccess(res, file, fileList) {
          this.form.viewDeatilList[this.form.index].url = this.imageUrl
          this.form.viewDeatilList[this.form.index].imgKey = this.key
        },
        upLoadError (res, file) {
          this.$message.error('上传失败，请重新选择！')
        },
        del(sign, index) {
          if(sign.noUpload){
            this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
                api.viewDelete({ id: sign.id }).then(res => {
                  if(res.code === 200) {
                    this.$message({ type: 'success', message: '删除成功' })
                    this.getData()
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
            
          } else {
            this.form.viewDeatilList.splice(index, 1)
          }
        },
        add () {
          if (this.form.viewDeatilList.length < 6) {
            this.form.viewDeatilList.push({ url: '', imgKey: '', msgDesc: '', noUpload: false })             
          } else {
            this.$message({ type: 'warning', message: '最多添加六张图片' })
          }
        },
        async submitKeep (sign) {
          if(sign.url === '' || sign.imgKey === ''){
            this.$message({ type: 'warning', message: '请选择图片' })
            return false
          }else {
            const { code, data, err } = await api.viewAdd({
              type: this.form.type,
              viewDeatilList: [{
                descMsg: sign.msgDesc,
                imgKey: sign.imgKey,
                url: sign.url
              }]
            })
            if (code === 200) {
              this.$message({ type: 'success', message: '添加成功' })
              this.getData()
            } else {
              this.$message.error(err)
            }
          }
        },
        hashFileName(filename) {
          return Math.random().toString(36).substr(2, 9) + '.' + (/[^.]+$/.exec(filename) || '')
        },
        onCopy () {
          this.$message({ type: 'success', message: '复制成功' })
        },
        onError () {
          this.$message.error('复制失败' )
        }
      }
    }
</script>

<style scoped>
  .avatar{
    width: 100%;
    height: 100%;
  }
</style>
