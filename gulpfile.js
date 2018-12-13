const gulp = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');

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
    .pipe(gulp.dest('build'));
    done();
})
gulp.task('default', gulp.series('clean','less',(done) => {
    done();
}));