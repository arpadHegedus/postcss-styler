let postcss = require('postcss'),
    util = require('postcss-plugin-utilities');

module.exports = postcss.plugin('postcss-styler-media', (opt = {}) => {
    return css => {
        opt = Object.assign({
            wide: 'only screen and (min-width: 769px)',
            narrow: 'only screen and (max-width: 768px)'
        }, opt);
        css.walkAtRules('media', atrule => { 
            let params = atrule.params.split(' and '),
                newParams = [];
            params.forEach(param => {
                if (util.sassHasVar(`media-${param}`, atrule.nodes[0])) {
                    param = `#{$media-${param}}`;
                } else if (opt.hasOwnProperty(param)) { 
                    param = opt[param];
                }
                newParams.push(param);
            });
            atrule.params = newParams.join(' and ');
        });
    }
});