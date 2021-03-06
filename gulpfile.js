var gulp = require('gulp');

//plugins installed with "npm install xxx --save"(to find in package.json)
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var filesize = require('gulp-filesize');

//paths paterns used for follow tasks
var paths = {
    appJS: "./app/**/*.js",
    appCSS: "./app/**/*.css",
    appHTML: "./app/**/*.html",
    appRoot: "app/",
    bowerExclude: "!./app/bower_components/**",
    bowerComponentsAll: "./app/bower_components/**",
    bundledJSExclude: "!./app/js/bundled.js",
    destAll: "./dist/*",
    destDir: "./dist/",
    destBowerComponentsDir: "./dist/bower_components",
    destRoot: 'dist/'
};
//tasks

//checks for code quality in the JS files. If there are any issues the build fails and all errors output to the console.
gulp.task('lint', function(){
    //all source js files excepting the installed extern libraries
    gulp.src([paths.appJS, paths.bowerExclude, paths.bundledJSExclude ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))//to display colored output
        .pipe(jshint.reporter('fail'));
});

//removes the entire build folder so that we start fresh every time we generate a new build.
gulp.task('clean', function(){
    gulp.src(paths.destAll)
        .pipe(clean({force:true}));
    //delete the bundled.js every time!
    gulp.src('./app/js/bundled.js')
        .pipe(clean({force:true}));
});

//minify CSS and put the result in destination directory.
gulp.task('minify-css', function(){
    var opts = {comments: true, spare: true};
    gulp.src([paths.appCSS, paths.bowerExclude])
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest(paths.destDir))
});

//minify JS files and put the result in destination directory.
gulp.task('minify-js', function(){
    var opts = {
        //inSourceMap:
        //outSourceMap: "app.js.map";
    };
    gulp.src([paths.appJS, paths.bowerExclude])
        .pipe(uglify(opts))
        .pipe(gulp.dest(paths.destDir))
});

//copy all installed runtime libs to destination dir
gulp.task('copy-bower-components',function(){
    gulp.src(paths.bowerComponentsAll)
        .pipe(gulp.dest(paths.destBowerComponentsDir))
});

//copy all HTML files to according destination dir.
gulp.task('copy-html-files',function(){
    gulp.src(paths.appHTML)
        .pipe(gulp.dest(paths.destDir))
});


//create the bundled JS file (display the file size for stats)
gulp.task('browserify', function(){
   gulp.src(['app/js/app.js'])
       .pipe(browserify({
           insertGlobals: true,
           debug: true
       }))
        .pipe(concat('bundled.js'))
        .pipe(gulp.dest('./app/js'))
        .pipe(filesize())
});

//This task simply updates where the bundled.js is stored after creation.
gulp.task('browserifyDist', function(){
    gulp.src(['app/js/app.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('bundled.js'))
        .pipe(gulp.dest('./dist/js'))
});

// we can group together multiple watch processes into a watch task
//the second arument lists the tasks that should be completed before 'watch'.
//Now, if you run gulp watch in the command line, Gulp should start listed tasks concurrently. When both tasks are completed, watch will run.
gulp.task('watch', [], function(){
    gulp.watch(paths.appJS,['lint']); //call lint task if the file matching pattern of paths.appJS has been saved.
    //here to be other watchers:    //...

});

//do the live reloading if the html or JS file has been changed
gulp.task('browserSync', function(){
    browserSync({
        server:{
            baseDir: paths.appRoot //tells the browserSync where the root of the server should be
        }
    })
});

//start the web server for development directory
gulp.task('connect', function(){
    connect.server({
    root: paths.appRoot,
    port: 4000
  });
});

//start the web server for destination directory
gulp.task('connectDist', function(){
    connect.server({
        root: paths.destRoot,
        port: 5000
    });
});

//default task (to run with "gulp" command)  - the development task that will be called most often.
//this just serves the files in the "app" folder on http://localhost:4000/.
gulp.task('default',
    //the tasks that should be completed before "default" is starting
    [/*'lint',*/ 'clean','browserify','connect']
);


//The build task creates a new directory called "dist", runs the linter, minifies the CSS and JS files,
//and copies all the HTML files and Bower Components.
//You can then see what the final build looks like on http://localhost:9999/ before deployment.
//You should also run the clean task before you generate a build.
gulp.task('build',
    [/*'lint',*/'clean','minify-css','minify-js', 'browserifyDist','copy-html-files','copy-bower-components', 'connectDist']
);

//build without js-hint (TODO: clarify the use strict and using the SampleApp as variable in controllers
gulp.task('build-no-lint',
    ['minify-css','minify-js','copy-html-files','copy-bower-components', 'connectDist']
);
