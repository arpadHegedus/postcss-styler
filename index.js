/**
 * POSTCSS STYLER
 * @version 2.0.3
 * @author Arpad Hegedus <hegedus.arpad@gmail.com>
 */

let postcss = require('postcss');

module.exports = postcss.plugin('styler', (opt = {}) => {
    let css = postcss();
    opt = Object.assign({
        modules: ['remove-comments', 'media', 'at-style', 'icon', 'color', 'var', 'google-color', 'font', 'font-vsize', 'sides', 'timing-function', 'clear-fix', 'morphicon', 'gridder'],
        sass: {
            indentType: 'tab',
            indentWidth: '1',
            outputStyle: 'expanded'
        },
        grid: {
            columns: 12,
            mode: 'flex'
        },
        media: {
            wide: 'only screen and (min-width: 769px)',
            narrow: 'only screen and (max-width: 768px)'
        }
    }, opt);
    css.use(require('postcss-import'));
    if (opt.modules.indexOf('at-style') >= 0) { css.use(require('postcss-at-style')); }
    if (opt.modules.indexOf('remove-comments') >= 0) { css.use(require('./modules/remove-comments.js')); }
    if (opt.modules.indexOf('media') >= 0) { css.use(require('./modules/media.js')(opt.media)); }
    if (opt.modules.indexOf('icon') >= 0) { css.use(require('./modules/icon.js')); }
    if (opt.modules.indexOf('color') >= 0) { css.use(require('./modules/color')); }
    if (opt.modules.indexOf('var') >= 0) { css.use(require('./modules/var.js')); }
    if (opt.modules.indexOf('google-color') >= 0) { css.use(require('postcss-google-color')); }

    css.use(require('postcss-node-sass')(opt.sass));

    if (opt.modules.indexOf('font') >= 0) { css.use(require('postcss-font')); }
    if (opt.modules.indexOf('font-vsize') >= 0) { css.use(require('postcss-font-vsize')); }
    if (opt.modules.indexOf('sides') >= 0) { css.use(require('postcss-sides')); }
    if (opt.modules.indexOf('timing-function') >= 0) { css.use(require('postcss-timing-function')); }
    if (opt.modules.indexOf('clear-fix') >= 0) { css.use(require('postcss-clear-fix')); }
    if (opt.modules.indexOf('morphicon') >= 0) { css.use(require('postcss-morphicon')); }
    if (opt.modules.indexOf('gridder') >= 0) { css.use(require('postcss-gridder')(opt.grid)); }
    return css;
});