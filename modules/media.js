let postcss = require('postcss');

module.exports = postcss.plugin('postcss-styler-media', (opt = {}) => {
    return css => {
        opt = Object.assign({
            wide: 'only screen and (min-width: 769px)',
            narrow: 'only screen and (max-width: 768px)'
        }, opt);
        let varExists = (v, node) => {
            let parent = (node.parent) ? node.parent : null,
                variable = false;
            if (parent) {
                parent.walkDecls(`$${v}`, decl => { variable = true; });
                if (variable) { return true; }
                return varExists(v, parent);
            }
            return false;
        };
        css.walkAtRules('media', atrule => { 
            let params = atrule.params.split(' and '),
                newParams = [];
            params.forEach(param => {
                if (varExists(`media-${param}`, atrule.nodes[0])) {
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