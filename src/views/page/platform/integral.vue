<template>
  <div class="app-container integral">
    <el-table :data="list" border style="width: 100%">
      <!-- <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          {{scope.row.content.score === 1 ? '用户' : scope.row.content.score === 2 ? '司机' : '回收者'}}
        </template>
      </el-table-column> -->
      <el-table-column prop="title.value" label="行为"  align="center" min-width="140"></el-table-column>
      <el-table-column label="获得积分数量"  align="center">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.content.score"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="是否多次获取积分开关" align="center">
        <template slot-scope="scope">
          <span @click="useOpenChange(scope.row.content)">
            <el-switch active-color="#13ce66" v-model="scope.row.content.ifEnable" disabled style="cursor: pointer"></el-switch>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="dialog-container text-center">
      <el-button type="primary" @click="submitKeep">保存</el-button>
    </div>
  </div>

</template>

<script>
  import api from '@/api/platform'
  export default {
    name: 'integral',
    data() {
      return {
        list: []
      }
    },
    created () {
      this.getData()
    },
    methods: {
      async getData() {
        this.listLoading = true
        this.list = []
        const { code, data, err } = await api.getConfig()
        this.listLoading = false
        if (code === 200) {
            let title
            for(let i in data) {
              switch(i) 
              {
                case 'userShareScore':
                  title = '用户分享积分配置'
                  break;
                case 'userEvaluateScore':
                  title = '用户评分获取的分数'
                  break;
                case 'userCompleteScore':
                  title = '用户完成订单获取的分数'
                  break;
                case 'userRegisterScore':
                  title = '用户分享后用户注册分数'
                  break;
                case 'recyclerShareScore':
                  title = '回收者分享积分配置'
                  break;
                case 'recyclerCompleteDriverOrderScore':
                  title = '回收者评分获取的分数'
                  break;
                case 'recyclerCompleteScore':
                  title = '回收者完成订单获取的分数'
                  break;
                case 'recyclerRegisterScore':
                  title = '回收者分享后用户注册分数'
                  break;
                case 'driveReservationComplete':
                  title = '司机预约完成积分配置'
                  break;
                case 'driverShareScore':
                  title = '司机分享积分配置'
                  break;
              }
              this.list.push({ title: { type: i, value: title } , content: data[i] })
            }
        } else {
          this.$message.error(err)
        }
      },
      async useOpenChange(sign) {
        if (sign.ifEnable) {
          const { code, data, err } = await api.disableConfig({ key: sign.key })
          if(code === 200) {
            sign.ifEnable = false
            this.$message({
              type: 'success',
              message: '关闭'
            })
          } else {
            this.$message.error(err)
          }
        } else {
          const { code, data, err } = await api.enableConfig({ key: sign.key })
          if(code === 200) {
            sign.ifEnable = true
            this.$message({
              type: 'success',
              message: '打开'
            })
          } else {
            this.$message.error(err)
          }
        }
      },
      async submitKeep () {
        let list = {}
        this.list.forEach(item => {
          list[item.title.type] = item.content
        })
        // console.log(JSON.stringify(list))
        const { code, data, err } = await api.setConfig(list)
        if(code === 200) {
          this.getData()
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        } else {
          this.$message.error(err)
        }
      },
      
    }
  }
</script>

