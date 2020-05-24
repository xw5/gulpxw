"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `欢迎使用基于gulp的多页脚手架： ${chalk.bgWhite.bold.red(
          "generator-gulpxw"
        )}`,
        { maxLength: 30 }
      )
    );

    const prompts = [
      {
        type: "list",
        name: "cssPreprocessor",
        choices: ["less", "sass", "stylus"],
        message: "选择你想使用的css预处理器?",
        default: "less"
      },
      {
        type: "confirm",
        name: "isNeedRem",
        message: "是否需要使用rem布局?",
        default: false
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    // 直接复制的文件
    let copyList = [
      "package-lock.json",
      "config.js",
      ".gitignore",
      ".jshintrc"
    ];

    copyList.forEach(item => {
      this.fs.copy(this.templatePath(item), this.destinationPath(item));
    });

    let copyTplList = ["gulpfile.js", "package.json"];

    copyTplList.forEach(item => {
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.props
      );
    });
  }

  install() {
    this.npmInstall()
      .then(
        function() {
          this.log(
            yosay(
              `WOW,工程初始化完成!\n 开发运行：npm run dev \n 发布运行：npm run build`,
              { maxLength: 30 }
            )
          );
        }.bind(this)
      )
      .catch(function() {
        this.log(
          chalk.white.bold.bgRed(
            ` 安装依赖失败!\n cd ${this.props.name}\n npm install\n 可手动安装依赖。`
          )
        );
      });
  }
};
