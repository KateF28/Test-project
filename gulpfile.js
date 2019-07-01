const gulp = require('gulp');
const sass = require('gulp-sass');                          //sass
const browserSync = require('browser-sync').create();       //runtime watcher and changer
const clean = require('gulp-clean');                        //cleaner product directory "dev"
const cleanCSS = require('gulp-clean-css');                 //CSS minifier
const sourcemaps = require('gulp-sourcemaps');              //SCSS navigation in Chrome inspector
const rename = require("gulp-rename");                      //rename files after minify
const concat = require('gulp-concat');                      //concat for js
const terser = require('gulp-terser');                      //minify for js
const autoprefixer = require('gulp-autoprefixer');          //cross-browser compatibility css
const babel = require('gulp-babel');                        //cross-browser compatibility js
const nunjucks = require('gulp-nunjucks-render');           //template engine
const imagemin = require('gulp-imagemin');

// const fontsFiles = [                                        
//     './src/fonts/**.eot',
//     './src/fonts/**.ttf',
//     './src/fonts/**.woff',
//     './src/fonts/**.otf'
// ];

const imgFiles = [
    './src/img/**/**.svg',
    './src/img/**/**.jpg',
    './src/img/**/**.png'
];

function cleandev() {                                       
    return gulp.src('./dist', {read: false})
        .pipe(clean())
}

function img() {                                            
    return gulp.src(imgFiles)
    .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'))
}

// function fonts () {                                      
//     return gulp.src(fontsFiles)
//         .pipe(gulp.dest('./dist/fonts'))
// }

function js () {                                            
    return gulp.src('./src/js/*.js')
        .pipe(gulp.dest('./dist/js'))
}

function scripts () {
    return gulp.src('src/sections/**/*.js')
        .pipe(babel({                                           
            presets: ['@babel/env']
        }))
        .pipe(terser({                                          
            toplevel: true
        }))                                                     
        .pipe(concat('all.js'))                                 
        .pipe(rename(function (path) {                          
            path.extname = ".min.js";
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
}

function forSass() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(cleanCSS({level: 2}))                             
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],                               
            cascade: false
        }))
        .pipe(rename(function (path) {                          
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({                                          
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('./src/**/*.scss', forSass);             
    gulp.watch('./src/**/*.js', scripts);
}

gulp.task('cleandev', cleandev);
gulp.task('img', img);
gulp.task('scripts', scripts);
gulp.task('sass', forSass);
gulp.task('watch', watch);
// gulp.task('fonts', fonts);
gulp.task('js', js);
gulp.task('build', gulp.series('cleandev', gulp.series(img, js, scripts, forSass)));
gulp.task('dev', gulp.series('build', watch));