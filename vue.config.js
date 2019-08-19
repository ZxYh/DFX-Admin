const path = require('path')
const config = require('./config')
// const webpack = require('webpack')

const serverHost = config.serverHost

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // https://github.com/vuejs/vue-cli/tree/dev/docs/zh/config

  // 项目部署的基础路径
  // 我们默认假设你的应用将会部署在域名的根部，
  // 比如 https://www.my-app.com/
  // 如果你的应用时部署在一个子路径下，那么你需要在这里
  // 指定子路径。比如，如果你的应用部署在
  // https://www.foobar.com/my-app/
  // 那么将这个值改为 `/my-app/`
  baseUrl: '', // 用法和 webpack 本身的 output.publicPath 一致

  // 将构建好的文件输出到哪里
  outputDir: 'dist',

  // 是否在保存的时候使用 `eslint-loader` 进行检查。
  // 有效的值：`ture` | `false` | `"error"`
  // 当设置为 `"error"` 时，检查出的错误会触发编译失败。
  lintOnSave: true,

  // 使用带有浏览器内编译器的完整构建版本
  // 查阅 https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时
  // compiler: false,

  // 调整内部的 webpack 配置。
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
  configureWebpack: {
    externals: {
      AMap: 'AMap',
      AMapUI: 'AMapUI'
    }
  },

  // vue-loader 选项
  // 查阅 https://vue-loader.vuejs.org/zh-cn/options.html
  // vueLoader: {},

  // 是否为生产环境构建生成 source map
  productionSourceMap: false,

  // CSS 相关选项
  css: {
    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    extract: true,
    // 是否开启 CSS source map
    sourceMap: false,
    // 默认开启 autoprefixer，配置目标浏览器，请在 package.json > browserslist 配置
    // 为预处理器的 loader 传递自定义选项。比如传递给
    // sass-loader 时，使用 `{ sass: { ... } }`。
    loaderOptions: {},
    // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    // 这个选项不会影响 `*.vue` 文件。
    modules: false
  },

  // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
  // 在多核机器下会默认开启。
  parallel: require('os').cpus().length > 1,

  // 是否使用 `autoDLLPlugin` 分割供应的包？
  // 也可以是一个在 DLL 包中引入的依赖的显性的数组。
  // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#dll-模式
  // dll: false,

  // PWA 插件的选项。
  // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli-plugin-pwa/README.md
  // pwa: {},

  // 配置 webpack-dev-server 行为。
  devServer: {
    // open: process.platform === 'darwin',
    open: false,
    host: '0.0.0.0',
    port: 4000,
    https: false,
    hotOnly: false,
    proxy: {
      '/pf-api': {
        target: serverHost,
        changeOrigin: true
      }
    }, // string | Object
    before: app => {
      // `app` 是一个 express 实例
    },
    overlay: true // 编译器错误或警告时，全屏提示
  },

  // 三方插件的选项
  pluginOptions: {
    // ...
  }
}
