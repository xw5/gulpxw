# generator-gulpxw
> 基于yeoman+gulp(webpack)的多页面脚手架

## 安装

### 全局安装yeoman和generator-gulpxw

```bash
npm install -g yo
npm install -g generator-gulpxw
```

### 通过yo命令生成项目模板：

方式一 对于新起项目，可以通过yo gulpxw生成全新项目模板

```bash
    yo gulpxw
```
方式二 对于已经存在的项目，可以通过yo gulpxw:adapt 可在老项目下生成项目构建所需的相关配置文件，再修改config.js适配目录结构，达到老项目也能使用的目的

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

 ## 脚手架生成的项目目录
 通过脚手架生成的项目目录结构如下:

 * 所有开发文件都存放于***src***目录下
 * ***src/assets***存放静态资源
 * ***src/otherlib***存放第三方库，如jquery,layui等
 * ***src/scripts***存放脚本文件，子目录core下存放一些js模块文件
 * ***src/sprite***存放图片资源文件，会按目录生成精灵图文件和对应css文件
 * ***src/styles***存放样式文件，子目录core存放css模块文件
 * ***src/template***存放html模块文件

## 特别注意
> * 对于不想使用css预处理器的，less和sass随便选一个即可,他们完全兼容原生css写法的
> * 对于网络不是特别好的不推荐使用自动精灵图生成，在我自测过程中发现自动生成精灵图会很大概率出现PhantomJS not found on PATH，如果你坚持要用，你可以按提示操作，去提示指定的url下载下来再拷贝到指定目录也可解决,推荐用户把图片放在sprite目录下再运行npm run sprite手动生成精灵图再来使用即可。
> * 项目目录结构是支持配置的，config.js可以指定各文件所存放目录，这样即可适配老项目，也可以按个人喜好安排目录结构

 ``` md
 projectName:
│  .jshintrc
│  backup.gitignore
│  config.js
│  gulpfile.js
│  package.json
│  
└─src
    │  index.html
    │  other.html  
    ├─assets
    │      
    ├─otherlib
    │  └─jquery
    │          
    ├─scripts
    │  └─core
    │          
    ├─sprite
    │  ├─index
    │  └─other
    │          
    ├─styles
    │  └─core      
    └─template
 ```

## License

ISC© [xiewu](https://gitee.com/github-9819409)
