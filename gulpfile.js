var lr = require('tiny-lr'), // Минивебсервер для livereload
    gulp = require('gulp'), // Сообственно Gulp JS
    jade = require('gulp-jade'), // Плагин для Jade
    less = require('gulp-less'), // Плагин для Less
    livereload = require('gulp-livereload'), // Livereload для Gulp
    myth = require('gulp-myth'), // Плагин для Myth - http://www.myth.io/
    csso = require('gulp-csso'), // Минификация CSS
    imagemin = require('gulp-imagemin'), // Минификация изображений
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    connect = require('connect'), // Webserver
    server = lr();


// Собираем Less
gulp.task('less', function() {
    gulp.src('./assets/less/main.less')
        .pipe(less({
            use: ['nib']
        })) // собираем stylus
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
        .pipe(myth()) // добавляем префиксы - http://www.myth.io/
        .pipe(gulp.dest('./public/css/')) // записываем css
        .pipe(livereload(server)); // даем команду на перезагрузку css
});

// CSS
gulp.task('css', function() {
    gulp.src('./assets/css/**/*')
        .pipe(gulp.dest('./public/css/')) // записываем css
        .pipe(livereload(server)); // даем команду на перезагрузку css
});

// font
gulp.task('font', function() {
    gulp.src('./assets/font/**/*')
        .pipe(gulp.dest('./public/font/'))
        .pipe(livereload(server));
});

// Собираем html из Jade
gulp.task('jade', function() {
    gulp.src(['./assets/template/**/*.jade', '!./assets/template/**/_*.jade'])
        .pipe(jade({
            pretty: true
        }))  // Собираем Jade только в папке ./assets/template/ исключая файлы с _*
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
        .pipe(gulp.dest('./public/')) // Записываем собранные файлы
        .pipe(livereload(server)); // даем команду на перезагрузку страницы
});

// Собираем JS
gulp.task('js', function() {
    gulp.src(['./assets/js/**/*.js', '!./assets/js/vendor/**/*.js'])
        .pipe(concat('index.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
        .pipe(gulp.dest('./public/js'))
        .pipe(livereload(server)); // даем команду на перезагрузку страницы
});

// Копируем и минимизируем изображения
gulp.task('images', function() {
    gulp.src('./assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img'))

});

gulp.task('vendors', function(){
    // vendors boostrap
    gulp.src(["./assets/vendors/bootstrap/dist/**/*", "!./assets/vendors/bootstrap/dist/**/*.min.*"])
        .pipe(gulp.dest('./public/vendors/bootstrap/dist/'));

    // vendors jquery
    gulp.src("./assets/vendors/jquery/jquery.js")
        .pipe(gulp.dest('./public/vendors/jquery/'));

    // vendors davis
    gulp.src("./assets/vendors/davis/davis.js")
        .pipe(gulp.dest('./public/vendors/davis/'));

    // vendors normalize-css
    gulp.src("./assets/vendors/normalize-css/*.css")
        .pipe(gulp.dest('./public/vendors/normalize-css/'));
});

// Локальный сервер для разработки
gulp.task('http-server', function() {
    connect()
        .use(require('connect-livereload')())
        .use(function(req, res, next){
            if (req.url.indexOf('.') == -1) req.url = "/index.html";
            next();
        })
        .use(connect.static('./public'))
        .listen('9000');

    console.log('Server listening on http://localhost:9000');
});

// Запуск сервера разработки gulp watch
gulp.task('watch', function() {
    // Предварительная сборка проекта
    gulp.run('less');
    gulp.run('jade');
    gulp.run('images');
    gulp.run('js');
    gulp.run('vendors');
    gulp.run('font');
    gulp.run('css');

    // Подключаем Livereload
    server.listen(35729, function(err) {
        if (err) return console.log(err);

        gulp.watch('assets/css/**/*.css', function() {
            gulp.run('css');
        });
        gulp.watch('assets/less/**/*.less', function() {
            gulp.run('less');
        });
        gulp.watch('assets/template/**/*.jade', function() {
            gulp.run('jade');
        });
        gulp.watch('assets/img/**/*', function() {
            gulp.run('images');
        });
        gulp.watch('assets/js/**/*', function() {
            gulp.run('js');
        });
    });
    gulp.run('http-server');
});

gulp.task('build', function() {
    // css
    gulp.src('./assets/less/main.less')
        .pipe(less({
            use: ['nib']
        })) // собираем stylus
        .pipe(myth()) // добавляем префиксы - http://www.myth.io/
        .pipe(csso()) // минимизируем css
        .pipe(gulp.dest('./build/css/')); // записываем css

    // jade
    gulp.src(['./assets/template/**/*.jade', '!./assets/template/**/_*.jade'])
        .pipe(jade())
        .pipe(gulp.dest('./build/'));

    // js
    gulp.src(['./assets/js/**/*.js', '!./assets/js/vendor/**/*.js'])
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    // image
    gulp.src('./assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'));

    // css
    gulp.src('./assets/css/**/*')
        .pipe(gulp.dest('./build/css'));

    // font
    gulp.src('./assets/font/**/*')
        .pipe(gulp.dest('./build/font'));


    // vendors boostrap
    gulp.src(["./assets/vendors/bootstrap/dist/**/*", "!./assets/vendors/bootstrap/dist/**/*.min.*"])
        .pipe(gulp.dest('./build/vendors/bootstrap/dist/'));

    // vendors jquery
    gulp.src("./assets/vendors/jquery/jquery.js")
        .pipe(gulp.dest('./build/vendors/jquery/'));

    // vendors davis
    gulp.src("./assets/vendors/davis/davis.js")
        .pipe(gulp.dest('./build/vendors/davis/'));

    // vendors normalize-css
    gulp.src("./assets/vendors/normalize-css/*.css")
        .pipe(gulp.dest('./build/vendors/normalize-css/'));

});
