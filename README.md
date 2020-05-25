# generator-gulpxw
> 基于yeoman+gulp(webpack)的多页面脚手架

## 安装

### 全局安装yeoman和generator-gulpxw（暂未发布到npm）

```bash
npm install -g yo
npm install -g https://gitee.com/github-9819409/gulpxw.git
```

### 通过yo命令生成项目模板：

方式一 对于新起项目，可以通过yo gulpxw可生成全新项目模板

```bash
    yo gulpxw
```
方式二 对于已经存在的项目，可以通过yo gulpxw:adapt 可在旧老项目下生成项目构建所需的相关配置文件，再修改config.js适配目录结构，达到老项目也能使用的目的

```bash
    yo gulpxw:adapt
```

## 使用

```bash
    npm run dev  // 走开发流程
    npm run build // 走打包流程
```


## 脚手架特性

 * 可配置性强
    * 通过初始化命令行选择自己需要的功能
    * 可通过修改***config.js***，自由配置项目结构和一些构建方式
 * css预处理器支持：***Less/Sass/Stylus***
 * css模块化：***@import***语法自动打包
 * JS模块化开发：***Commonjs/Es6 Module***
 * HTML模块化，支持模板渲染：***@@include***引入模板文件
 * Es6语法支持，自动生成Es5
 * js压缩混淆/css压缩
 * 静态资源[asetsname.hash.ext]版本管理
 * 静态资源cdn路径自动替换
 * 本地多端同步开发服务器：***BrowserSync***
 * 保存自动刷新界面
 * 开发服务器请求接口跨域解决：****httpProxyMiddleware***
 * 精灵图生成
 * 移动端REM布局：***pxtorem***

## License

Apache-2.0 © [xiewu](https://gitee.com/github-9819409)


[npm-image]: https://badge.fury.io/js/generator-gulpxw.svg
[npm-url]: https://npmjs.org/package/generator-gulpxw
[travis-image]: https://travis-ci.com/xw5/generator-gulpxw.svg?branch=master
[travis-url]: https://travis-ci.com/xw5/generator-gulpxw
[daviddm-image]: https://david-dm.org/xw5/generator-gulpxw.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/xw5/generator-gulpxw
