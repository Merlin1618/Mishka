/* eslint-disable semi */
'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const concat = require('gulp-concat');
const cleancss = require('gulp-cleancss');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
  gulp.watch(['app/*.html', 'app/CSS/*.css', 'app/CSS/SASS/*.scss', 'app/js/*.js'], {
    cwd: 'app'
  }, reload);
});

gulp.task('sass', function () {
  return gulp.src('app/CSS/SASS/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(gulp.dest('app/CSS'))
});

gulp.task('sass:watch', function () {
  gulp.watch('app/CSS/SASS/*.scss', ['sass'])
});

gulp.task('watch', ['browser-sync'], function () {
  gulp.watch('app/CSS/SASS/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/*.js', browserSync.reload);
});

gulp.task('clean', function () {
  return del.sync('dist');
});

gulp.task('image', () =>
  gulp.src('app/img/Originals/*')
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
          removeViewBox: true
        },
        {
          cleanupIDs: false
        }
        ]
      })
    ]))
    .pipe(webp())
    .pipe(gulp.dest('app/img'))
);

gulp.task('build', ['clean'], function () {
  var buildCss = gulp.src(['app/CSS/*.css'])
    .pipe(cleancss({
      keepBreaks: false
    }))
    .pipe(autoprefixer({
      browsers: ['last 15 versions', 'cover 99.5%'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/CSS/'))

  var buildFonts = gulp.src('app/Fonts/*')
    .pipe(gulp.dest('dist/Fonts'))

  var buildJs = gulp.src('app/js/*')
    .pipe(gulp.dest('dist/js'))

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

  var buildImg = gulp.src('app/img/*.webp')
    .pipe(gulp.dest('dist/img/'));
});
gulp.task('default', ['watch']);
