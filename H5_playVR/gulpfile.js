const gulp = require('gulp');
const del = require('del');
//加载gulp-load-plugins插件，并马上运行它
const plugins = require('gulp-load-plugins')();

// 异步执行 先执行 clean，再执行之后操作 
gulp.task('build', ['clean'], function () {
    gulp.start('imageMin', 'cssMinify', 'jsLibConcat', 'jsBusinessConcat', 'jsOtherUglify', 'htmlReplace');
});

// test plugin
gulp.task('default', function () {
    console.log('gulp: test plugin load!');
    // 1. 使用gulp-load-plugins
    console.log(plugins);
});

gulp.task('clean', function () {
    return del([
        'dist/*'
    ]);
});
// 任务  - image文件压缩
gulp.task('imageMin', function () {
    gulp.src('src/images/**/*.{png,jpg,gif,ico}')
        .pipe(plugins.imagemin())
        .pipe(gulp.dest('dist/images'));
});

// 任务  - css文件压缩
gulp.task('cssMinify', function () {

    // css文件压缩 minifyCss
    gulp.src('src/css/*.css')   // 要压缩的css文件
        .pipe(plugins.minifyCss()) //使用minifyCss进行压缩
        .pipe(gulp.dest('dist/css')); // 压缩之后存放文件的路径
});

// 任务  -  js代码检查
gulp.task('jsLint', function () {
    gulp.src('src/js/**/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter()); // 输出检查结果
});

// 任务 - js库文件合并
gulp.task("jsLibConcat", function () {
    // 把src下js库文件合并压缩为video.min.js
    gulp.src(['src/js/three.js', 'src/js/hls.js'])
        .pipe(plugins.concat('video.min.js'))
        .pipe(plugins.uglify()) // 压缩
        .pipe(gulp.dest('dist/js'));
});

// 任务 - js业务代码十六进制转换压缩合并
gulp.task("jsBusinessConcat", function () {
    gulp.src(['src/js/vr.js', 'src/js/app.js'])
        .pipe(plugins.concat('iphone.js')) // 合并
        .pipe(plugins.str2hex({
            hexall: false, // whether hex all strings or not, default: false
            placeholdMode: 1,   //0 - keep string in their positions, 1(alias `prependMap`) - use a array includes all the strings, and expose the array as a variable prepend the code, 2(alias `wrapWithIife`) - use a array includes all the strings, and use Iife to wrap the array as a parameter of the function;
            compress: true //compress the code, remove new lines, comments and spaces, instead of uglify-js, default true ,available values: true or false
        })) // 十六进制加密
        .pipe(gulp.dest('dist/js'));
});

// 任务 - 其他js处理 除了lib函数和bussiness函数
gulp.task("jsOtherUglify", function () {
    // 把src下js库文件合并压缩为video.min.js
    gulp.src(['src/js/*.js', '!src/js/**/{three,hls,vr,app}.js'])
        .pipe(plugins.uglify()) // 压缩
        .pipe(gulp.dest('dist/js'));
});

// 任务 - html引用替换
gulp.task("htmlReplace", function () {
    gulp.src(['src/play.html'])
        .pipe(plugins.htmlReplace({
            //'css': 'css/index.min.css',
            'jsLib': 'js/video.min.js',
            'jsBusiness': 'js/iphone.js'
        }))
        .pipe(gulp.dest('dist'));
});