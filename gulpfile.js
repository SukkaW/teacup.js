const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const header = require('gulp-header');
const pkg = require('./package.json');

let jsBanner = ['/*!',
    ' * teacup.js | v<%= pkg.version %>',
    ' * Author: SukkaW',
    ' * Link: https://github.com/SukkaW/teacup.js',
    ' * License: <%= pkg.license %>',
    ' */'
].join('\n');

let configs = {
    browsers: [
        'last 2 versions',
        'IE >= 8',
        'not dead',
        'not op_mini all'
    ]
};

gulp.task('minify-js', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            "presets": [
                ["@babel/env", {
                    "targets": configs.browsers
                }]
            ]
        }))
        .pipe(uglify({
            keep_fnames: false
        }))
        .pipe(header(jsBanner, { pkg: pkg }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.parallel('minify-js'));

gulp.task('default', gulp.parallel('build'));
