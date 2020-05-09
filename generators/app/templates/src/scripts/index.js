let test = "hello wordl yeoman!";
let testa = require("./core/a.js");
import testb from "./core/b.js";
import testfnExport from "./core/c.js";
let testFn = () => {
  console.log("hello world testFn!");
};

console.log(test);
console.log(testa.a, testb.a);
testFn();
testfnExport();

$.ajax({
  url: "/api/user",
  type: "GET",
  success: function(res) {
    console.log("ajax success:", res);
  },
  error: function(res) {
    console.log("ajax fail:", res);
  }
});