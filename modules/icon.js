let postcss = require('postcss'),
    util = require('postcss-plugin-utilities');

module.exports = postcss.plugin('postcss-styler-icon', () => {
    return css => { 
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
        css.walkDecls('icon', decl => {
            let parent = decl.parent,
                declVal = (decl.value.match(/(?!\B(\(\")[^\"\(\)]*),(?![^\"\(\)]*(\)|\")\B)/ig) === null) ? postcss.list.space(decl.value) : postcss.list.comma(decl.value),    
                settings = util.filterObject((decl.value.indexOf(',') === -1) ? postcss.list.space(decl.value) : postcss.list.comma(decl.value), {
                    'icon': [() => { return true; }],
                    'selector': ['after', 'before'],
                    'font-size': [util.isSize],
                    'font-style': ['normal', 'italic', 'oblique', 'initial', 'inherit'],
                    'font-weight': ['100', '200', '300', '400', '500', '600', '700', '800', '900', 'normal', 'bold', 'bolder', 'lighter', 'initial', 'inherit'],
                    'line-height': [util.isSize, util.isNumber],
                    'text-align': ['left', 'right', 'center', 'justify', 'initial', 'inherit'],
                    'font-variant': ['normal', 'small-caps', 'initial', 'inherit'],
                    'color': [util.isColor],
                    'text-decoration': ['none', 'underline', 'overline', 'line-through', 'initial', 'inherit'],
                    'text-transform': ['none', 'capitalize', 'uppercase', 'lowercase', 'initial', 'inherit'],
                    'vertical-align': ['baseline', 'isSize', 'isSizeNegative', 'sub', 'sup', 'super', 'top', 'text-top', 'middle', 'bottom', 'text-bottom', 'initial', 'inherit'],
                    'word-wrap': ['normal', 'break-word', 'initial', 'inherit'],
                    'letter-spacing': [util.isSize, 'normal', 'initial', 'inherit'],
                    'word-spacing': [util.isSize, 'normal', 'initial', 'inherit'],
                    'text-indent': [util.isSize, 'initial', 'inherit'],
                    'white-space': ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'initial', 'inherit'],
                    'font-stretch': ['normal', 'ultra-condensed', 'extra-condensed', 'condensed', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded', '', 'unset', 'initial', 'inherit'],
                    'direction': ['ltr', 'rtl', 'initial', 'inherit'],
                    'unicode-bidi': ['normal', 'embed', 'bidi-override', 'initial', 'inherit']
                }, { selector: 'before' });
            if (settings.icon && varExists(`icon-${settings.icon}`, decl)) { 
                let fontName = 'icon';
                settings.icon.split('-').forEach(segment => { 
                    if (varExists(`${fontName}-${segment}-font-family`, decl)) { 
                        fontName = `${fontName}-${segment}`;
                    }
                });
                fontName = (varExists(`${fontName}-font-family`, decl)) ? `$${fontName}-font-family` : null;
                if (fontName) { 
                    let rule = postcss.rule();
                    rule.selector = util.eachSelector(parent.selector, `&:${settings.selector}`);
                    rule.append({ prop: 'font-family', value: fontName });
                    rule.append({ prop: 'content', value: `'#{$icon-${settings.icon}}'` });
                    delete settings.selector; delete settings.icon;
                    for (let [prop, val] of Object.entries(settings)) { 
                        rule.append({ prop: prop, value: val });
                    }
                    parent.before(rule);
                }
            }
            decl.remove();
        });
    }
});