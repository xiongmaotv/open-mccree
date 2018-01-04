const gulp = require('gulp');
const babel = require('gulp-babel');
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const uglify = require("gulp-uglify");
const gutil = require("gulp-util");
const rename = require('gulp-rename');
const webpack = require('gulp-webpack');
const del = require('del');
const eslint = require('gulp-eslint');

const path = require('path');
const chalk = require("chalk");
const through = require("through2");

function swapSrcWithLib(srcPath) {
  const parts = srcPath.split(path.sep);
  parts.forEach(function(val, index) {
    if (val === 'src') {
      parts[index] = 'build';
    }
  });

  return parts.join(path.sep);
}

function _lint(paths, exit) {
  return gulp.src(paths)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(exit ? eslint.failAfterError() : eslint.result(function() {}));
}

gulp.task('build', function() {
  var buildPath = [
    path.resolve(__dirname + '/src', '*.js'),
    path.resolve(__dirname + '/src', '**/*.js')
  ];

  gutil.log("Compiling", "'" + chalk.cyan('mccree') + "'...");

  return gulp.src(buildPath)
    .pipe(babel({
      presets: ['es2015']
    })).pipe(uglify())
    .pipe(gulp.dest(__dirname + '/build'));
});

gulp.task('clean', function() {
  var delPath = [
    path.resolve(__dirname + '/build', '*.js'),
    path.resolve(__dirname + '/build', '**/*.js'),
    path.resolve(__dirname + '/build', '*.js')
  ];
  return del(delPath);
});


gulp.task('lint', function() {
  var lintPath = [
    path.resolve(__dirname + '/src', '*.js'),
    path.resolve(__dirname + '/src', '**/*.js')
  ];
  return _lint(lintPath, true);
});


gulp.task('webpack', ['clean', 'lint', 'build'], function() {
  let opt = {
    devtool: 'source-map',
    output: {
      path: __dirname + '/dist',
      filename: 'index.js'
    }
  };
  return gulp.src(path.resolve(__dirname + '/build', 'index.js'))
    .pipe(webpack())
    .pipe(rename('index.min.js'))
//    .pipe(uglify())
    .pipe(gulp.dest(__dirname + '/dist'));
});