<template>
    <div class="app-container">
        <el-form :model="form" ref="form" :rules="rules">
            <h3 class="margin10">订单可选择时间段</h3>
            <el-time-select v-model="form.start" :picker-options="{ start: '00:00', step: form.min,end: '24:00'}" placeholder="选择时间"></el-time-select>
            <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
            <el-time-select v-model="form.end" :picker-options="{ start: '00:00', step: form.min,end: '24:00', minTime: form.start}" placeholder="选择时间"></el-time-select>
            <h3 class="margin10" style="margin-top: 50px">下单时间间隔</h3>
            <el-form-item prop="step">
              <el-input v-model.trim="form.step" @input="getMin('form')" validate-event placeholder="请输入" class="min">
                <template slot="append">min</template>
              </el-input>
            </el-form-item>
            <el-form-item class="keep">
              <el-button type="primary" @click="submitKeep('form')">保存</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
  import api from '@/api/platform'
  export default {
    data() {
      var min = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('时间段不能为空'))
        } else if (/^[1-9]\d*$/.test(value) == false) {
          callback(new Error("请输入一个正整数"));
        } else if (parseInt(value) < 30) {
          callback(new Error(`最短时间间隔为60分钟`));
        } else if (parseInt(value) >= 60*24) {
          callback(new Error(`最长时间间隔不得超过为${60*24}分钟`));
        } else {
          callback();
        }
      }
      return {
        form: {
          start: '',
          end: '',
          step: '',
          min: '01:00'
        },
        rules: {
          step: [
            { validator: min, trigger: 'change' }
          ]
        }
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData () {
        const { code, data, err } = await api.getTime()
        if(code === 200) {
          this.form.start = data.startTime
          this.form.end = data.endTime
          this.form.step = data.gapMinute
        }
      },
      async submitKeep (formName) {
        function subSplit(obj) {
          if (obj.substr(0, 1) === '0') {
            obj = obj.substr(1)
            return obj
          } else {
            return obj
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.setTime({
              endTime: this.form.end+':00',
              gapMinute: this.form.step,
              startTime: this.form.start+':00'
            }).then(res => {
               if(res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
              } else {
                this.$message.error('系统错误，请稍后再试');
              }
            })
          }else {
            return false
          }
        })
        
      },
      getMin (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.min = this.focusMin(this.form.step)
          }else {
            return false
          }
        })
      },
      focusMin(character) {
        let num = parseInt(character)
        if (num/60 < 1 && num > 0){
          if (num < 10){
            return `00:0${num}`
          } else {
            return `00:${num}`
          }
        } else if(num/60 >= 1 && num/60 < 24){
          if (num/60<10) {
            if (num%60 < 10){
              return `0${parseInt(num/60)}:0${num%60}`
            } else {
              return `0${parseInt(num/60)}:${num%60}`
            }
          }else {
            if (num%60 < 10){
              return `${parseInt(num/60)}:0${num%60}`
            } else {
              return `${parseInt(num/60)}:${num%60}`
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
    .keep{
        padding: 50px 200px;
    }
</style>
