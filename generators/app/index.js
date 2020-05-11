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
        )}`
      )
    );

    const prompts = [
      {
        type: "textinput",
        name: "name",
        message: "新生成的工程的名字:",
        default: "newprojects"
      },
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
        message: "是否需要使用rem布局",
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
      "src/assets",
      "src/scripts",
      "src/sprite",
      "src/template/footer.html",
      "src/index.html",
      "src/other.html",
      "src/styles/core/footer.css",
      "src/styles/core/normalize.css",
      "package-lock.json",
      "config.js",
      ".gitignore",
      ".jshintrc"
    ];

    // eslint-disable-next-line default-case
    switch (this.props.cssPreprocessor) {
      case "less":
        copyList.push(
          "src/styles/other.less",
          "src/styles/index.less",
          "src/styles/core/test.less"
        );
        break;
      case "sass":
        copyList.push(
          "src/styles/other.scss",
          "src/styles/index.scss",
          "src/styles/core/test.scss"
        );
        break;
      case "stylus":
        copyList.push(
          "src/styles/other.styl",
          "src/styles/index.styl",
          "src/styles/core/test.styl"
        );
        break;
    }

    copyList.forEach(item => {
      this.fs.copy(
        this.templatePath(item),
        this.destinationPath(this.props.name + "/" + item)
      );
    });

    let copyTplList = [
      "src/template/header.html",
      "gulpfile.js",
      "package.json"
    ];

    copyTplList.forEach(item => {
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(this.props.name + "/" + item),
        this.props
      );
    });
  }

  install() {
    var npmdir = process.cwd() + "/" + this.props.name;
    process.chdir(npmdir);
    this.npmInstall();
  }
};
