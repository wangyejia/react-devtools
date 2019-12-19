const gulp = require('gulp');
const electron = require('electron-connect').server.create();

gulp.task('watch:electron', function() {
    // watch:electron 为你的任务名字
    electron.start();
    gulp.watch(['src/electron-main/*'], electron.restart); //这里的路径根据你的文件路径来
});
