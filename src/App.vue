<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import api from '@/api/login'
export default {
}
</script>

<style lang="less">
html {
  font-size: 14px;
}

body {
  font-size: #333333;
}
html, body {
  height: 100%;
  width: 100%;
  font-family: PingFangSC-Regular,"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  background: #F7F7F7;
}
* {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
a {
  text-decoration: none;
}
input, button {
  outline: none;
}
button{
  border: none;
}

#app {
  height: 100%;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}

</style>
