import Vue from 'vue'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

const vue = new Vue()

// 辅助通用方法
const regexp = {
  numberAndLetter: /^[0-9a-zA-Z]*$/, // 账号，可以为数字和字母
  phoneOrEmail: /(^1[34578]{1}\d{9}$)|(^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$)/,
  phone: /^1[34578]{1}\d{9}$/, // 手机号
  email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/, // 邮箱地址
  integer: /^(0|[1-9][0-9]*)$/, // 是否整数
  number: /^\d*$/, // 是否数字
  letter: /^[a-zA-Z]*$/, // 纯字母
  // qq: /^[1-9][0-9]{4,9}$/gim,
  chinese: /[\u4e00-\u9fa5]/, // 是否中文
  code: /^[1-9]\d{5}$/g, // 邮政编码
  IdCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, // 身份证
  // pwd: /^[a-zA-Z0-9]+$/, // 密码(包含数字字母大小写)
  // pwd: /^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,16}$/, // 密码
  pwdStartWithLetter: /^[a-zA-Z]+[0-9a-zA-Z]*$/, // 密码首位为字母
  pwdStartWithUpperCase: /^[A-Z]+[0-9a-zA-Z]*$/, // 密码首字母为大写字母
  ip: /(\d+)\.(\d+)\.(\d+)\.(\d+)/, // ip地址
  pwd: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/ // 数字字母大小写 6-16位
}

export default {
  // 格式化日期时间
  formatDate (separator, ifHaveTime) {
    let date = new Date()
    separator = separator || '/'
    // timeDelimiter = timeDelimiter || ':'
    ifHaveTime = ifHaveTime || false
    function addZero (val) {
      if (+val < 10) {
        return '0' + val
      }
      return val
    }
    let str = ''
    str = date.getFullYear() + separator + addZero(date.getMonth() + 1) + separator + addZero(date.getDate())
    if (ifHaveTime) {
      str += ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds())
    }
    return str
  },
  // 验证，使用了Notify组件作为错误提示
  validate (val, type, msg, callback) {
    try {
      if (!regexp[type].test(val)) {
        // vue.$notify.error({ title: '提示', message: msg })
        callback(new Error(msg))
      }
      return regexp[type].test(val)
    } catch (err) {
      vue.$notify.error({ title: '警告', message: '验证程序出错' })
      return false
    }
  },
  // 验证账号
  validateAccount (value, callback) {
    if (!regexp['numberAndLetter'].test(value)) {
      callback(new Error('账号由字母和数字组成'))
    } else {
      callback()
    }
  },
  // 验证密码
  validatePwd (value, callback) {
    if (!value) {
      callback(new Error('密码不能为空'))
    } else if (!regexp['pwd'].test(value)) {
      callback(new Error('密码必须包含数字、大小写字母，长度8-16'))
    } else {
      callback()
    }
  },
  // 验证手机号码
  validatePhone (value, callback) {
    if (!value) {
      callback(new Error('手机号码不能为空'))
    } else if (!regexp['phone'].test(value)) {
      callback(new Error('请输入11数字'))
    } else {
      callback()
    }
  },
  // 金额格式化，每三位数字用逗号隔开，并取两位小数
  money (value) {
    const val = (value / 1).toFixed(2)
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },
  // 数量格式化，每三位数字用逗号隔开
  num (value) {
    const val = value / 1
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },
  // 数组去重
  deleteRepeat (array) {
    return [...new Set(array)]
  },
  // 数组排序
  rangeArray (array) {
    let allNumber = true
    array.forEach((item) => {
      if (typeof +item !== 'number') {
        allNumber = false
      }
    })
    if (!allNumber) {
      return false
    }
    return array.sort((a, b) => {
      return a - b
    })
  }
  /*
  ** 验证密码
  ** pwd：密码，length：密码长度 {min: 1, max: 20} 默认1-20
  ** type：类型 1：纯数字；2：纯字母；3：数字加字母；4：数字加字母，首位必须字母；5：数字加字母，首位必须大写字母。 默认 type = 1
  */
  // validatePwd(pwd, length, type, msg) {
  //   console.log(pwd, length, type, msg)
  //   // try {
  //   //   if (type === 1) {
  //   //     validate(pwd, 'number', msg)
  //   //   } else if (type === 2) {
  //   //     validate(pwd, 'letter', msg)
  //   //   } else if (type === 3) {
  //   //     validate(pwd, 'numberAndLetter', msg)
  //   //   } else if (type === 4) {
  //   //     validate(pwd, 'pwdStartWithLetter', msg)
  //   //   } else {
  //   //     validate(pwd, 'pwdStartWithUpperCase', msg)
  //   //   }
  //   // } catch (err) {
  //   //   return false
  //   // }
  // }
}
