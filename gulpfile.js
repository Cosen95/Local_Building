const gulp = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const cleanCSS = require('gulp-clean-css');

gulp.task('clean', (done) => {
    del.sync('build');
    done();
})

gulp.task('less', (done) => {
    gulp.src('src/**/*.less')
    .pipe(less())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('build'));
    done();
})
gulp.task('default', gulp.series('clean','less',(done) => {
    done();
}));

gulp.task('watch', () => {
    const watcher = gulp.watch('src/**/*',gulp.series('default'));
    watcher.on('change', event => {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    })
})