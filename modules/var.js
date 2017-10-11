let postcss = require('postcss'),
    util = require('postcss-plugin-utilities');

module.exports = postcss.plugin('postcss-styler-var', () => {
    let applyVars = o => {
        ['params', 'selector', 'prop', 'value'].forEach(prop => {
            if (o.hasOwnProperty(prop)) {
                o[prop] = o[prop].replace(/(^v\(|[\s\(\,\)]v\()/ig, (s) => { return s.replace('v(', 'var('); });
                o[prop] = o[prop].replace(/(^c\(|[\s\(\,\)]c\()/ig, (s) => { return s.replace('c(', 'var(color-'); });
                o[prop] = o[prop].replace(/var\(([^\,\)]+)(\,((([^\(\)]+)?\(([^\(\)]+)?\)([^\(\)]+)?)|[^\)]+))?\)/ig, (s, v, d = null) => {
                    if (d) { d = d.slice(2); }
                    if (d === 'null' || d === 'false') { d = null; }
                    if (util.sassHasVar(v, o)) { return `$${v}`; }
                    else if (d) { return d; }
                    else {
                        if (o.type !== 'atrule') {
                            removeEmpty(o);
                        }
                        return null;
                    }
                });
            }
        });
    };
    let removeEmpty = o => {
        let parent = o.parent;
        o.remove();
        if (parent && parent.nodes.lenght == 0) {
            removeEmpty(parent);
        }
    }
    return css => {
        css.walkAtRules(atrule => { applyVars(atrule); });
        css.walkRules(rule => { applyVars(rule); });
        css.walkDecls(decl => { applyVars(decl); });
    }
});