module.exports = {
  distPath: './dist', // 开发构建打包到的目录
  buildPath: './build', // 构建代码打包到的目录
  browsers: ["last 50 version","> 1%","IE 9"], // css兼容处理
  isVersion: true, // 是否要启动版本管理,如index.js -> index.098f6bcd.js
  designWidth: 750, // 设计稿宽度，用于rem转px
  /**
   * 下面配置用于生产构建，主要用于有些项目的静态资源要放cdn的，配置此参数gulp会自动替换html中的路径
   * 假设此路径配http://www.cdn.com/,如html中通过./scripts/index.js,则生成后的代码会指向http://www.cdn.com/scripts/index.js
   */
  cdnUrl: 'https://www.baidu.com/', // 如上线后资源需要上传cdn的，可以修改些参数，gulp会自动把html中的资源地址替换成配置的地址
  
  /**
   * 解决开发环境接口请求跨域的问题
   * 下面示例配置会把http://localhost:8088/api/[user]的接口代理到http://localhost:3000/[user]
   * 也就是说/api开头的接口都会被代理到http://localhost:3000上云
   * 如不需做接口代理，则可以把proxy配置成null或者删掉即可
   * 示例配置
   * proxy: {
        api: '/api', // 要被代理的api,会代理所有以/api开头的接口
        pathRewrite: { // api重写
          '^/api': ''
        },
        target: 'http://localhost:3000' // 要代理到的地址,一般是服务端提供给你的接口服务器地址
      }
   */
  port: 8088,// 本地开发服务器的端口配置,遇到端口冲突可修改此参数
  proxy: null // 如开发环境要做代理可按如上注释的示例配置即可
}