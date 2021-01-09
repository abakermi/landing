"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cp = require("child_process");
const cssnano = require("cssnano");
const del = require("del");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const webpack = require("webpack");
// const webpackconfig = require("./webpack.config.js");
const webpackstream = require("webpack-stream");

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "."
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean assets
function clean() {
  return del(["./dist/"]);
}

// Optimize Images
function images() {
  return gulp
    .src("./img/**/*")
    .pipe(newer("./_site/assets/img"))
    // .pipe(
    //   imagemin([
    //     imagemin.gifsicle({ interlaced: true }),
    //     imagemin.mozjpeg({ progressive: true }),
    //     imagemin.optipng({ optimizationLevel: 5 }),
    //     imagemin.svgo({
    //       plugins: [
    //         {
    //           removeViewBox: false,
    //           collapseGroups: true
    //         }
    //       ]
    //     })
    //   ])
    // )
    .pipe(gulp.dest("./_site/assets/img"));
}

// CSS task
function css() {
  return gulp
    .src("./assets/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }).on('error', sass.logError))
    .pipe(gulp.dest("./_site/assets/css/"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("./_site/assets/css/"))
    .pipe(browsersync.stream());
}

// Lint scripts
function scriptsLint() {
  return gulp
    .src(["./assets/js/**/*", "./gulpfile.js"])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// Transpile, concatenate and minify scripts
function scripts() {
  return (
    gulp
      .src(["./assets/js/**/*"])
      .pipe(plumber())
    //   .pipe(webpackstream(webpack))
      // folder only, filename is specified in webpack config
      .pipe(gulp.dest("./_site/assets/js/"))
      .pipe(browsersync.stream())
  );
}
function html() {
  return (
    gulp
      .src(["./_site/**/*",])
      .pipe(gulp.dest("./dist/_site"))
      .pipe(browsersync.stream())
  );
}
function index() {
  return (
    gulp
      .src(['index.html'])
      .pipe(gulp.dest("./dist/"))
      .pipe(browsersync.stream())
  );
}
function fonts() {
    return (
      gulp
        .src(["./assets/fonts/**/*"])
        .pipe(plumber())
      //   .pipe(webpackstream(webpack))
        // folder only, filename is specified in webpack config
        .pipe(gulp.dest("./_site/assets/fonts/"))
        .pipe(browsersync.stream())
    );
  }
// Jekyll
function jekyll() {
  return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" });
}

// Watch files
function watchFiles() {
  gulp.watch("./assets/scss/**/*", css);
  gulp.watch("./assets/js/**/*", gulp.series( scripts));
  gulp.watch("./assets/fonts/**/*", gulp.series( fonts));
  gulp.watch(
    [
      ".",
      "./_layouts/**/*",
      "./_pages/**/*",
      "./_posts/**/*",
      "./_projects/**/*"
    ],
    gulp.series(browserSyncReload)
  );
  gulp.watch("./img/**/*", images);
}

// define complex tasks
const js = gulp.series( scripts);
const build = gulp.series(clean, gulp.parallel(css, images, js,html,index));
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.images = images;
exports.css = css;
exports.js = js;

exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;