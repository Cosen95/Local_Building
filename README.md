# Local_Building

## 前端工程化（本地构建）

## 项目依赖

### gulp
1.全局安装gulp
`yarn global add gulp`

2.作为项目的开发依赖（devDependencies）安装
`yarn add gulp --dev`

3.在项目根目录下创建一个名为 gulpfile.js 的文件：
```
var gulp = require('gulp');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});

```

4.运行gulp
`$ gulp`

#### gulp api
* `gulp.src(globs[, options])`
输出（Emits）符合所提供的匹配模式（glob）或者匹配模式的数组（array of globs）的文件。 将返回一个 Vinyl file的 stream 它可以被 piped 到别的插件中。
* `gulp.dest(path[, options])`
能被 pipe 进来，并且将会写文件。并且重新输出（emits）所有数据，因此你可以将它 pipe 到多个文件夹。如果某文件夹不存在，将会自动创建它。
* `gulp.task(name[, deps], fn)`
定义一个使用 Orchestrator 实现的任务（task）。
* `gulp.watch(glob [, opts], tasks)`
监视文件，并且可以在文件发生改动时候做一些事情。它总会返回一个 EventEmitter 来发射（emit） change 事件。

#### gulp 插件
* `gulp-less`
将less文件编译成CSS。

1.安装
`yarn add gulp-less`

2.基本使用
```
var less = require('gulp-less');
var path = require('path');
 
gulp.task('less', function () {
  return gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/css'));
});

```
* `gulp-autoprefixer`
根据设置浏览器版本自动处理浏览器前缀。使用它我们可以不必考虑各浏览器兼容前缀，在写完后再自动处理。

1.安装
`yarn add gulp-autoprefixer`

2.基本使用
```
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
 
gulp.task('default', () =>
    gulp.src('src/app.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'))
);

```
* `del`
你也许会想要在编译文件之前删除一些旧文件。由于删除文件和文件内容并没有太大关系，所以，我们没必要去使用一个 gulp 插件。最好是选择使用一个原生的 node 模块，因为 del 模块支持多个文件以及模式匹配，因此，我们将使用它来删除文件。

1.安装
`yarn add del`

2.基本使用
```
gulp.task('clean', (done) => {
    del.sync('build');
    done();
})

```
* `gulp-clean-css`
使用gulp-clean-css压缩css文件，减小文件大小，并给引用url添加版本号避免缓存。（之前的有同样功能的gulp-minify-css已被废弃）

1.安装
`yarn add gulp-clean-css`

2.基本使用
```
let gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');
 
gulp.task('minify-css', () => {
  return gulp.src('styles/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});

```

#### gulp4填坑
* throw new assert.AssertionError || done is not a function
> Gulp 4最大的变化就是你不能像以前那样传递一个依赖任务列表。
Gulp3，如果有一个任务A，B和C的列表，你想在一个序列中运行（确保A在B开始之前完成，而B在C开始之前完成），代码如下：
```
gulp.task('a', function () {
  // Do something.
});
gulp.task('b', ['a'], function () {
  // Do some stuff.
});
gulp.task('c', ['b'], function () {
    // Do some more stuff.
});

```
在Gulp 4中，你不能再这样做了。你会得到以下错误：
```
assert.js:85
  throw new assert.AssertionError({
  ^
AssertionError: Task function must be specified
    at Gulp.set [as _setTask] (/home/hope/web/node_modules/undertaker/lib/set-task.js:10:3)
    at Gulp.task (/home/hope/web/node_modules/undertaker/lib/task.js:13:8)
    at Object.<anonymous> (/home/hope/web/gulpfile.js:31:6)
    at Module._compile (module.js:570:32)
    at Object.Module._extensions..js (module.js:579:10)
    at Module.load (module.js:487:32)
    at tryModuleLoad (module.js:446:12)
    at Function.Module._load (module.js:438:3)
    at Module.require (module.js:497:17)
    at require (internal/module.js:20:19)

```
不要用Gulp3的方式指定依赖任务，你需要使用gulp.series和gulp.parallel，因为gulp任务现在只有两个参数。
```
gulp.series：按照顺序执行
gulp.paralle：可以并行计算

```
```
gulp.task('my-tasks', gulp.series('a', 'b', 'c', function() {
  // Do something after a, b, and c are finished.
}));

```
```
gulp.task('build', gulp.parallel('styles', 'scripts', 'images', function () {
  // Build the website.
}));

```
* 相关任务必须在被调用之前发生。
在Gulp 3中，可以让你的文件引用它们之前的任务，因为一切都是默认异步执行的。现在，您需要在依赖关系在您的gulp文件中定义之后放置调用依赖项的任务。否则，你会得到这样的错误：
```
assert.js:85
  throw new assert.AssertionError({
  ^
AssertionError: Task never defined: serve
    at getFunction (/home/hope/web/node_modules/undertaker/lib/helpers/normalizeArgs.js:15:5)
    at arrayMap (/home/hope/web/node_modules/lodash.map/index.js:140:21)
    at map (/home/hope/web/node_modules/lodash.map/index.js:1836:10)
    at normalizeArgs (/home/hope/web/node_modules/undertaker/lib/helpers/normalizeArgs.js:19:10)
    at Gulp.series (/home/hope/web/node_modules/undertaker/lib/series.js:13:14)
    at Object.<anonymous> (/home/hope/web/gulpfile.js:41:27)
    at Module._compile (module.js:570:32)
    at Object.Module._extensions..js (module.js:579:10)
    at Module.load (module.js:487:32)
    at tryModuleLoad (module.js:446:12)

```
> gulp4中需要指定task结束
gulp4中，必须告诉gulp我们的task任务已经完成了。gulp3中，我们不必要这么做，因为如果没有发出异步完成信号，那么当任务返回时，gulp会认为它已经完成了，gulp4中必须明确指出任务完成了。

解决方法：使依赖任务在文件的底部。

1.使用回调函数作为您的任务的第一个参数，只需在完成时调用该函数。
```
gulp.task('clean', function(done) {
  del(['build]);
    done();
});

```

2.告诉gulp任务完成的另一个常见方法是 返回(return) 一个流或者** Promise**：
```
gulp.task('message', function() {
  return new Promise(function(resolve, reject) {
    console.log("HTTP Server Started");
    resolve();
  });
});

```

### babel
Babel 通过语法转换器支持最新版本的 JavaScript 

1.安装babel
`yarn add babel-cli babel-preset-env`

2.创建.babelrc文件
```
{
  "presets": ["env"]
}

```

#### Polyfill
由于 Babel 只转换语法(如箭头函数)， 你可以使用 babel-polyfill 支持新的全局变量，例如 Promise 、新的原生方法如 String.padStart (left-pad) 等。

1.安装
`yarn add babel-polyfill`

2.使用它时需要在你应用程序的入口点顶部或打包配置中引入。

#### JSX
Babel 能够转换 JSX 语法并去除类型注释。

1.安装
`yarn add babel-preset-react`

2.添加 "react" 到你的 .babelrc 的 presets 数组中。
```
{
  "presets": ["env","react"]
}

```
#### Source map
支持 Source map 因此可以轻松调试编译后代码。

#### babel-plugin-transform
针对不在babel-preset-env中的，babel提供了babel-plugin-transform来支持相应的方法，如`babel-plugin-transform-object-assign`、`babel-plugin-transform-object-rest-spread`