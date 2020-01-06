import gulp from 'gulp';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';

const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

const server = browserSync.create();

const paths = {
    styles: {
        src: 'assets/scss/**/*.scss',
        dest: 'assets/css/'
    }
};

const fontawesome = () => {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('assets/fonts/webfonts'));
}

const styles = () => {
    return gulp.src(paths.styles.src)
        .pipe(sass({
            outputStyle: 'compressed',
            precision: 10,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        .on('error', sass.logError)
        .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe(gulp.dest(paths.styles.dest))
}

const reload = (done) => {
    server.reload();
    done();
}

const serve = (done) => {
    server.init({
        proxy: 'localhost/exemplo1'
    });
    done();
}

const watch = () => gulp.watch(paths.styles.src, gulp.series(styles, reload));

const dev = gulp.series(fontawesome, styles, serve, watch);

export default dev;