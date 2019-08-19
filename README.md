### 设计技术栈
> vue@2.5.16、vue-router、webpack@4+、es6、scss、lodash、element-ui@2.4.1、@vue/cli@3.0.0-rc.1

### 食用指南

``` bash
# 复制配置
cp config.js.example config.js

# install dependencies
npm install

# run
npm run serve

# build 
npm run build
```

### 项目开发规范

* 文件名全小写，单词间用 `-` 连接
* CSS

```
尽量不使用 id，class 前缀如下
g 全局性
m 模块
u 组件
f 功能
```

* 文件组织

```
+-- assets 静态资源。一般图片。按目录分好，以下也是。
+-- components 公共组件
+-- views 业务页面
|   +-- module-name
|   |   +-- index.vue
+-- utils
|   +-- request.js 封装的网络请求组件
|   +-- tools.js 公共方法
+-- index.html
+-- app.vue
+-- router.js 路由文件
+-- main.js 入口文件
```