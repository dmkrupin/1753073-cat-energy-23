const gulp = require("gulp");
const plumber = require("gulp-plumber"); // code validator без остановки сборки
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
// ---------
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");

// превращаем стили less в css

const styles = () => {
  return gulp.src("source/less/style.less")  //style.less
    .pipe(plumber())                         //style.less(err->console)
    .pipe(sourcemap.init())                  //style.less(capture1)
    .pipe(less())                            //style.less->style.css
    .pipe(postcss([                          //style.css
      autoprefixer()                         //style.css(prefixed)
    ]))
    .pipe(csso())                            //style.css(prefixed, minified)
    .pipe(rename("style.min.css"))           //style.min.css(prefixed, minified)
    .pipe(sourcemap.write("."))              //style.min.css(prefixed, minified. capture2)
    .pipe(gulp.dest("build/css"))           //кладем в папочку build
    .pipe(sync.stream());
}

exports.styles = styles;

// запускаем сервер

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/**/*.less", gulp.series(styles));
  gulp.watch("source/**/*.js", gulp.series(scriptMinify));
  gulp.watch("source/*.html"), gulp.series(htmlMinify, reload );
}
// Reload
const reload = (done) => {
  sync.reload();
  done();
}
// ----------------------------------------------------------
//минифицируем html в build

const htmlMinify = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}
exports.htmlMinify = htmlMinify;

//Минифицируем скрипты в build
const scriptMinify = () => {
  return gulp.src("source/**/*.js", { base: process.cwd() })
    .pipe(terser())
    .pipe(rename({
      dirname: "",
      suffix: ".min"
    }))
    .pipe(gulp.dest("build/js"));
}
exports.scriptMinify = scriptMinify;

//Оптимизируем картинки
const imagesOptimize = () => {
  return gulp.src("source/img/**/*.{svg,png,jpg}")
    .pipe(imagemin([
      imagemin.mozjpeg({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}
exports.imagesOptimize = imagesOptimize;

//Копируем картинки
const imagesCopy = () => {
  return gulp.src("source/img/**/*.{svg,png,jpg}")
    .pipe(gulp.dest("build/img"))
}
exports.imagesCopy = imagesCopy;

//Создаем webp картинки
const webpCreate = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({
      quality: 90
     }))
    .pipe(gulp.dest("build/img"))
}
exports.webpCreate = webpCreate ;

//Создаем svg спрайт
const spriteCreate = () => {
  return gulp.src("source/img/icons/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img/icons"))
}
exports.spriteCreate = spriteCreate ;

//Копируем в билд всякое разное
const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    // "source/img/**/*.svg",
    // "!source/img/icons/*.svg",
    "source/manifest.webmanifest"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}
exports.copy = copy ;

//Чистим папку build
const clean = () => {
  return del("build");
}
exports.clean = clean;

// -------------------------------------------
//Собираем build - готовый проект
const build = gulp.series(
  clean,
  copy,
  imagesOptimize,
  gulp.parallel(
    styles,
    htmlMinify,
    scriptMinify,
    webpCreate,
    spriteCreate
  ),
);
exports.build = build;

//Собираем билд для разработки
exports.default = gulp.series(
  clean,
  copy,
  imagesCopy,
  gulp.parallel(
    styles,
    htmlMinify,
    scriptMinify,
    webpCreate,
    spriteCreate
  ),
  gulp.series(
    server,
    watcher
  )
);


