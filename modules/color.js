let postcss = require('postcss'),
    util = require('postcss-plugin-utilities');

module.exports = postcss.plugin('postcss-styler-color', () => {
    let applyColor = o => {
        ['params', 'selector', 'prop', 'value'].forEach(prop => {
            if (o.hasOwnProperty(prop)) {
                o[prop] = o[prop].replace(/(^c\(|[\s\(\,\)]c\()/ig, (s) => { return s.replace('c(', 'color-variable('); });
                o[prop] = o[prop].replace(/color\-variable\(([^\s\)]+)(\s((([^\(\)]+)?\(([^\(\)]+)?\)([^\(\)]+)?)|[^\)]+))?\)/ig, (s, v, d = null) => {
                    let color = util.sassGetVar(`color-${v}`, o);
                    if (color === null) {
                        util.removeNode(o);
                    } else {
                        if (d !== null) {
                            d = d.trim();
                            if (color.indexOf('google-color(') >= 0) {
                                if (d === '95%') { d = '50'; }
                                if (d === '90%') { d = '100'; }
                                if (d === '80%') { d = '200'; }
                                if (d === '70%') { d = '300'; }
                                if (d === '60%') { d = '400'; }
                                if (d === '50%') { d = '500'; }
                                if (d === '40%') { d = '600'; }
                                if (d === '30%') { d = '700'; }
                                if (d === '20%') { d = '800'; }
                                if (d === '10%') { d = '900'; }
                                if (['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'A100', 'A200', 'A400', 'A700'].indexOf(d) >= 0) {
                                    color = color.replace(/google\-color\(([a-z]+)(\s?\,\s?[a-z0-9]+)?\)/ig, `google-color($1, ${d})`);
                                }
                            } else {
                                if (d === '50') { d = '95%'; }
                                if (d === '100' || d === 'A100') { d = '90%'; }
                                if (d === '200' || d === 'A200') { d = '80%'; }
                                if (d === '300') { d = '70%'; }
                                if (d === '400' || d === 'A400') { d = '60%'; }
                                if (d === '500') { d = '50%'; }
                                if (d === '600') { d = '40%'; }
                                if (d === '700' || d === 'A700') { d = '30%'; }
                                if (d === '800') { d = '20%'; }
                                if (d === '900') { d = '10%'; }
                                if (d.indexOf('%') >= 0) {
                                    color = `change-color($color-${v}, $lightness: ${d})`;
                                }
                            }
                        } else {
                            color = `$color-${v}`;
                        }
                        return color;
                    }
                });
            }
        });
    }
    return css => {
        css.walkAtRules(atrule => { applyColor(atrule); });
        css.walkRules(rule => { applyColor(rule); });
        css.walkDecls(decl => { applyColor(decl); });
    }
});