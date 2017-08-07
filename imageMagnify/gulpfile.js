var gulp = require('gulp');

//加载gulp-load-plugins插件，并马上运行它
var plugins = require('gulp-load-plugins')();
gulp.task('default', function () {
    console.log('gulp: hello world!');

    // 1. 使用gulp-load-plugins
    console.log(plugins);
});

// 任务  - js文件压缩
gulp.task('minify-js', function () {

    // js文件压缩 uglify
    gulp.src('src/js/**/*.js')   // 要压缩的js文件
        .pipe(plugins.uglify()) //使用uglify进行压缩,更多配置请参考：
        .pipe(gulp.dest('dist/js')); // 压缩之后存放文件的路径
});

// 任务  - css文件压缩
gulp.task('minify-css', function () {

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