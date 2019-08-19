import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress'
import router from '@/router'
import privateConfig from '../../config'
// import { Notification } from 'element-ui'
import store from '@/store'

const apiPath = privateConfig.prod
  ? privateConfig.prodApiHost + privateConfig.apiPath
  : privateConfig.apiPath
// console.log(apiPath)

axios.defaults.headers.common['wili-token-strategy'] = 'token'

axios.interceptors.request.use(config => {
  NProgress.start()
  if (localStorage.getItem('token')) {
    config.headers['wili-access-token'] = localStorage.getItem('token')
    config.headers['wili-token-strategy'] = `token`
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  if (response.headers['wili-access-token']) {
    localStorage.token = response.headers['wili-access-token']
    // store.commit('SET_TOKEN', {
    //   token: response.headers['wili-access-token']
    // })
    store.commit('SET_LOGIN', {
      ifLogin: true
    })
  }
  return response
}, error => {
  console.log(error)
  // if (error.response) {
  //   switch (error.response.status) {
  //     case 506:
  //       localStorage.removeItem('token')
  //       router.replace({
  //         path: '/login',
  //         query: { redirect: router.currentRoute.fullPath }
  //       })
  //   }
  // }
  return Promise.resolve(error.response)
})

function checkStatus (response) {
  NProgress.done()
  // console.log(response)
  if (response.status === 200 || response.status === 304) {
    if (response.data.status.errCode === 200) {
      return {
        code: response.data.status.errCode,
        data: response.data.data,
        err: response.data.status.message
      }
    }
    return {
      code: response.data.status.errCode,
      data: response.data.data,
      err: response.data.status.message
    }
  }
  return {
    code: response.status,
    data: response.statusText
  }
}

function checkCode (res) {
  if (res.code === 506) {
    store.commit('CLEAR_LOGIN')
    router.replace('/login')
  } else if (res.code !== 200) {
    Notification.error({ title: '警告', message: `${res.data}` })
  }
  return res
}
export default {
  post (url, data) {
    return axios({
      method: 'post',
      url: apiPath + url,
      data: qs.stringify(data),
      timeout: 30000,
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=UTF-8'
      }
    }).then(checkStatus).then(checkCode)
  },
  get (url, params) {
    return axios({
      method: 'get',
      url: apiPath + url,
      params,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(checkStatus).then(checkCode)
  },
  getBlob (url, params) {
    return axios({
      method: 'get',
      url: apiPath + url,
      params,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      responseType: 'blob'
    }).then(res => {
      return res
    })
  },
  postJson (url, data) {
    return axios({
      method: 'post',
      url: privateConfig.apiPath + url,
      data: data,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }).then(checkStatus).then(checkCode)
  }
}
