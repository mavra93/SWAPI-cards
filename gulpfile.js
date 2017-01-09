let gulp = require("gulp");
let $ = require("gulp-load-plugins")();
let mergeStream = require("merge-stream");
let runSequence = require("run-sequence");
let mainBowerFiles = require("main-bower-files");
let del = require("del");
let concat = require("gulp-concat");
let sass = require("gulp-sass");
let minifyCss = require("gulp-minify-css");


gulp.task("vendor:js", function () {
    const vendorJs = gulp.src(mainBowerFiles(["**/*.js"]))
        .pipe($.order([
            "**/jquery.js",
            "**/angular.js",
            "**/*.js"
        ]))
        .pipe($.concat("vendor.js"))
        .pipe($.uglify())
        .pipe(gulp.dest("./dist/vendor/scripts"));
    return mergeStream(vendorJs);
});

gulp.task("partials", function () {
    return gulp.src("app/js/**/*.html")
        .pipe($.angularTemplatecache("templates.js", {
            standalone: true
        }))
        .pipe(gulp.dest("dist/js/templates"));
});

gulp.task("vendor:css", function () {
    gulp.src(mainBowerFiles(["**/*.css"]))
        .pipe($.concat("bower.css"))
        .pipe(minifyCss())
        .pipe(gulp.dest("./dist/vendor/css"));
});


gulp.task("scripts", function () {
    return gulp.src(["app/js/**/*.js"])
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe($.concat("main.js"))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("html", function () {
    let files = ["app/index.html"];
    gulp.src(files)
        .pipe(gulp.dest("dist"));
});

gulp.task("fonts", function () {
    return gulp.src(require("main-bower-files")().concat("app/fonts/**/*"))
        .pipe($.filter("**/*.{eot,svg,ttf,woff,otf}"))
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task("scss", function () {
    return gulp.src("app/styles/main.scss")
        .pipe($.inject(
            gulp.src(["app/styles/*.scss", "!app/styles/main.scss"], {read: false}),
            {
                starttag: "/* inject:scss */",
                endtag: "/* endinject */",
                relative: true,
                transform: function (filepath) {
                    return '@import ' + "'" + filepath + "'" + ";";
                }
            }
        ))
        .pipe(gulp.dest("app/styles"));
});


gulp.task("styles", ["scss"], function (done) {
    gulp.src(["app/styles/main.scss"])
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest("dist/styles"))
        .on("end", done);
});

gulp.task("inject", function () {
        gulp.src("dist/index.html")
            .pipe($.inject(
                gulp.src(["js/**/*", "*.js"], {
                    cwd: __dirname + "/dist"
                }, {
                    read: false
                }), {
                    addRootSlash: false
                }
            ))
            .pipe($.inject(
                gulp.src("styles/**.css", {
                    cwd: __dirname + "/dist"
                }, {
                    read: false
                }),
                {
                    addRootSlash: false
                }))
            .pipe($.inject(
                gulp.src(["vendor/**/*.css", "vendor/**/*.js"], {
                    cwd: __dirname + "/dist"
                }, {
                    read: false
                }), {
                    starttag: "<!-- inject:bower:{{ext}} -->",
                    addRootSlash: false
                }))
            .pipe(gulp.dest("dist"));

    });


gulp.task("deploy", function (end) {
    $.cache.clearAll();
    runSequence(
        ["vendor:js", "vendor:css", "styles", "fonts", "scripts", "partials", "html"],
        "inject",
        end
    );
});

gulp.task("serve", ["deploy"], function () {
    const browserSync = require("browser-sync").create();
    const reload = browserSync.reload;
    const port = 9000;
    browserSync.init({
        notify: false,
        port: port,
        server: {
            baseDir: "dist"
        }
    });

    gulp.watch("app/js/**/*.js", [
        "scripts",
        reload
    ]);

    gulp.watch("app/**/*.html", [
        "partials",
        reload
    ]);
});


gulp.task("clean", del.bind(null, [
    "dist"
]));




