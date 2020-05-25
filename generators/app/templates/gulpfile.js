let config          = require("./config.js");// 全局自定义配置文件
var gulp            = require('gulp');
var jshint          = require('gulp-jshint');
var uglify          = require('gulp-uglify');// js压缩

<% if(cssPreprocessor=='less') {%>
var less            = require('gulp-less'); // less解析
<% } %>
<% if(cssPreprocessor=='sass') {%>
var sass            = require('gulp-sass'); // sass解析
sass.compiler       = require('node-sass');
<% } %>
<% if(cssPreprocessor=='stylus') {%>
var stylus          = require("gulp-stylus"); // stylus解析
<% } %>
var cssImport       = require("gulp-cssimport");// 原生@import css语法会以inline方式导入
var postcss         = require("gulp-postcss");// 精灵图生成
var lazysprite      = require("postcss-lazysprite");
<% if(isNeedRem) {%>
var pxtorem         = require("postcss-pxtorem");
<% } %>
var minifyCSS       = require('gulp-clean-css'); // css压缩
var prefix          = require('gulp-autoprefixer');// 添加浏览器前辍
var spriteMuti      = require("gulp.spritesmith-multi");

var cache           = require('gulp-cached'); // 构建缓存
var remmember       = require('gulp-remember');

var sourcemaps      = require('gulp-sourcemaps'); // 生成sourcemaps调试文件
let webpack         = require('webpack');
var webpackStream   = require('webpack-stream');
var named           = require('vinyl-named'); // 确保经过webpack-stream处理过的文件不改名

var includeTemplate = require("gulp-file-include"); // 支持公用html提取
var replaceUrl      = require("gulp-url-replace"); //  html中路径替换

var bSync           = require('browser-sync');// 启用开发服务器
var proxyFn         = require('http-proxy-middleware')
var reload          = bSync.reload;

var rev             = require('gulp-rev-all')

var gulpif          = require("gulp-if");
var plumber         = require('gulp-plumber');
var del             = require('del'); // 删除文件
var path            = require('path');
var slash           = require('slash');
var through         = require('through2'); // 为流创建一个新的步骤
var merge           = require("merge2");
// 一个空的步骤，什么都不做
var noop = function() {
  return through.obj();
}

var arguments   = require('yargs').argv; // 获取命令行传递的参数
var isDev = arguments.env === 'development' ? true : false; // 是否是开发环境

var watcherScript = null;

// 开发环境执行
var dev = function(task) {
  return isDev ? task : noop();
}

// 生产环境才执行
var prod = function(task) {
  return isDev ? noop() : task
}

var tempVerDir = './temp-version'; // 临时存放版本文件
var isNeedVer = config.isVersion; // 是否需要版本管理
var buildPath = config.buildPath; // 最终发布的目录
var outputDir = isDev ? config.distPath : (isNeedVer ? tempVerDir : buildPath); // 输出目录
// gulp.series 用于串行（顺序）执行
// gulp.parallel 用于并行执行

var getScriptPath = function() {
  return config.devBasePath +"/"+ config.scriptsPath
}

var getAssetsPath = function() {
  return config.devBasePath +"/"+ config.assetsPath
}

var getStylesPath = function() {
  return config.devBasePath +"/"+ config.stylesPath
}

var getHtmlPath = function() {
  return config.devBasePath +"/"+ config.htmlPath
}

var getHtmlTemplatePath = function() {
  return config.devBasePath +"/"+ config.templatePath
}

var getOtherLibPath = function() {
  return config.devBasePath +"/"+ config.otherLibPath
}

// 代码测试任务
gulp.task('test', function() {
   return gulp.src([getScriptPath()+'/**/*.js','!'+getOtherLibPath()+'/**'],{since:gulp.lastRun('test')})
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

// js任务
gulp.task('scripts',
   gulp.series('test', function scriptsInternal() {
     return gulp.src([getScriptPath()+'/*.js']) // ,{since: gulp.lastRun('scripts')})
      .pipe(plumber())
      //.pipe(cache('scripts')) // 存入缓存
      .pipe(named())
      .pipe(webpackStream({
        mode: isDev ? "development" : "production",
        devtool: isDev ? "source-map" : "",
        module: {
          rules:[
            {
              //test: /\.js&/,
              use: [{
                loader: 'babel-loader',
                options: {
                  presets:['@babel/preset-env']
                }
              }]
            }
          ]
        }
      }, webpack))
      //.pipe(remmember('scripts'))// 取出所有处理过的文件
      .pipe(dev(sourcemaps.write('.', {
        sourceRoot: 'js-source'
      })))
      .pipe(gulp.dest(outputDir+'/'+config.scriptsPath));
   })
);

// 样式处理任务
gulp.task('styles', function() {
  <% if(cssPreprocessor=='less') {%>
  return gulp.src(getStylesPath()+'/*.less')
  <% } %>
  <% if(cssPreprocessor=='sass') {%>
  return gulp.src(getStylesPath()+'/*.scss')
  <% } %>
  <% if(cssPreprocessor=='stylus') {%>
  return gulp.src(getStylesPath()+'/*.styl')
  <% } %>
    .pipe(plumber())
    .pipe(dev(sourcemaps.init()))
    .pipe(cssImport({}))
    <% if(cssPreprocessor=='less') {%>
    // 使用less预处理器
    .pipe(less())
    <% } %>
    <% if(cssPreprocessor=='sass') {%>
    // 使用sass预处理器
    .pipe(sass().on('error', sass.logError))
    <% } %>
    <% if(cssPreprocessor=='stylus') {%>
    // 使用stylus预处理器
    .pipe(stylus())
    <% } %>
    .pipe(postcss([

      // 精灵图
      lazysprite({
        imagePath:'./src/sprite',
        stylesheetInput: getStylesPath(),
        stylesheetRelative:  outputDir+'/'+config.stylesPath,
        spritePath: outputDir+'/'+config.assetsPath+'/sprites',
        nameSpace: 'icon-',
        outputDimensions: false,
        padding: 10,
        keepBackGroundSize: true
      })<% if(isNeedRem) { %>,
      // rem
      pxtorem({
        rootValue: config.designWidth / 10,
        replace: true,
        propList: ['*']
      })<% } %>
    ]))
    .pipe(prod(minifyCSS({
      compatibility: 'ie8'
    })))
    .pipe(prefix({
      browsers: config.browsers
    }))
    .pipe(dev(sourcemaps.write('.', {
      sourceRoot: 'css-source'
    })))
    .pipe(gulp.dest(outputDir+'/'+config.stylesPath));
});

// 移动静态文件到目标目录
gulp.task('moveAssets', function(done) {
  return gulp.src([getAssetsPath()+'/**/*.*'],{since: gulp.lastRun('moveAssets')}) // since增量构建：只会选中从上次运行moveAssets后修改的文件
  .pipe(plumber())
  .pipe(gulp.dest(outputDir+'/'+config.assetsPath));
  done();
});

// 移动第三方库到目标目录
gulp.task('moveLib', function(done) {
  return gulp.src([getOtherLibPath()+'/**/*.*'],{since: gulp.lastRun('moveLib')}) // since增量构建：只会选中从上次运行moveLib后修改的文件
  .pipe(plumber())
  .pipe(gulp.dest(outputDir+"/"+config.otherLibPath));
  done();
});

// 路径替换
var cdnUrl = config.cdnUrl ? config.cdnUrl : "./";
var changeUrl = {
  ["\\./"+config.stylesPath+"/"]: cdnUrl + config.stylesPath+"/",
  ["\\./"+ config.scriptsPath +"/"]: cdnUrl + config.scriptsPath +"/",
  ["\\./"+ config.assetsPath +"/"]: cdnUrl + config.assetsPath +"/",
  ["\\./"+ config.otherLibPath +"/"]: cdnUrl + config.otherLibPath +"/"
};
// html模板处理任务
gulp.task('includeTemplate', function() {
  return gulp.src([getHtmlPath()+'/*.html']) // ,{since: gulp.lastRun('includeTemplate')}since增量构建：只会选中从上次运行includeTemplate后修改的文件
  .pipe(plumber())
  .pipe(includeTemplate({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(gulpif(!isDev && !isNeedVer, replaceUrl(changeUrl)))
  .pipe(gulp.dest(outputDir+config.htmlPath));
});

var requestProxy = null;
if (config.proxy && config.proxy.api) {
  // 接口代理
  requestProxy = proxyFn.createProxyMiddleware(config.proxy.api, {
    target: config.proxy.target,
    changeOrigin: true,
    pathRewrite: config.proxy.pathRewrite,
    logLevel: 'debug'
  })
}

// 启动开发服务器
gulp.task('server', function(done) {
  if (isDev){
    bSync({
      server: {
        baseDir: [outputDir],
        middleware: requestProxy ? [requestProxy] : []
      },
      port: config.port
    })
  }
  done();
})

// 清理任务
gulp.task('clean', function() {
  let cleanDir = [outputDir];
  if (!isDev && isNeedVer) {
    cleanDir.push(buildPath);
  }
  return del(cleanDir);
});

// 版本管理
gulp.task("verCtrl", function (done) {
  if (!isDev && isNeedVer) {
    return gulp.src(tempVerDir+"/**")
      .pipe(rev.revision({
        dontRenameFile:[/.+\.html$/]
      }))
      .pipe(gulpif('*.html',replaceUrl(changeUrl)))
      .pipe(gulp.dest(buildPath+config.htmlPath))
  }
  done();
});

// 清除temp-version版本临时存放目录
gulp.task('cleanTemp', function() {
  return del([tempVerDir]);
});

// 主任务
gulp.task('default', gulp.series('clean', gulp.parallel('styles', 'scripts', 'includeTemplate', 'moveAssets', 'moveLib'), 'verCtrl', 'cleanTemp', 'server',
  function watcher(done) {
    if (isDev){
      watcherScript = gulp.watch([getScriptPath()+'/**/*.js'], gulp.parallel('scripts'));

      <% if(cssPreprocessor=='less') {%>
      // 监听less文件
      gulp.watch([getStylesPath()+'/**/*.less', getStylesPath()+'/**/*.css', config.devBasePath+'/sprite/**/*.*'], gulp.parallel('styles'));
      <% } %>
      <% if(cssPreprocessor=='sass') {%>
      // 监听scss文件
      gulp.watch([getStylesPath()+'/**/*.scss', getStylesPath()+'/**/*.css', config.devBasePath+'/sprite/**/*.*'], gulp.parallel('styles'));
      <% } %>
      <% if(cssPreprocessor=='stylus') {%>
      // 监听stylus文件
      gulp.watch([getStylesPath()+'/**/*.styl', getStylesPath()+'/**/*.css', config.devBasePath+'/sprite/**/*.*'], gulp.parallel('styles'));
      <% } %>

      gulp.watch([getHtmlPath()+'/**/*.html',getHtmlTemplatePath()+"/**/*.*"], gulp.parallel('includeTemplate'));
      gulp.watch(getAssetsPath()+'/**/*.*', gulp.parallel('moveAssets'));
      gulp.watch(getOtherLibPath()+'/**/*.*', gulp.parallel('moveLib'));

      gulp.watch(config.distPath+'/**/*.*').on('change', reload)
      // 管理缓存，当有监听到有文件删除时更新
      // watcherScript.on('unlink', function (filepath) {
      //   delete cached.caches['scripts'][slash(path.join(__dirname, filepath))]
      //   remmember.forget('scripts', slash(path.join(__dirname, filepath)))
      // })
    }
    done();
  })
);

/**** 手动精灵图生成任务 ****/
// 单独提供精灵图任务，解决想手动生成精灵图的需求
gulp.task('cleanSprite', function() {
  return del([config.devBasePath+"/spriteok/"])
});

gulp.task('sprites',gulp.series('cleanSprite', function createSprite() {
  var spriteData = gulp.src(config.devBasePath+"/sprite/**/*.png")
  .pipe(plumber())
  .pipe(spriteMuti({
    spritesmith: function(options, sprite, icons) {
      let data = sprite;
      options.padding = 10;
      options.cssTemplate = (data)=>{
      // data为对象，保存合成前小图和合成打大图的信息包括小图在大图之中的信息
        let arr = [],
        width = data.spritesheet.px.width,
        height = data.spritesheet.px.height,
        url =  data.spritesheet.image
        //console.log(data)
        arr.push(
          data.spritesheet_info.name+
          "{\n"+
              " background: url('"+url+"') no-repeat;\n"+
              " background-size: "+ width+" "+height+";\n"+
          "}\n"
        )
        data.sprites.forEach(function(sprite) {
            arr.push(
              data.spritesheet_info.name+"__"+sprite.name+
                "{\n"+
                  " background-position: "+ sprite.px.offset_x + " " + sprite.px.offset_y +";\n"+
                  " width: "+sprite.px.width+";\n"+
                  " height: "+sprite.px.height+";\n"+
                "}\n"
            )
        })
        return arr.join("")
      }
    }
  }))

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
  .pipe(gulp.dest(config.devBasePath+'/spriteok'))

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
  .pipe(gulp.dest(config.devBasePath+'/spriteok'))
  return merge(imgStream, cssStream);
}))
/**** 手动精灵图生成任务 ****/
