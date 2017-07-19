let postcss = require('postcss');

module.exports = postcss.plugin('postcss-styler-remove-comments', () => { 
    return css => {
        css.walkComments(comment => { comment.remove(); });
        css.walkRules(rule => { rule.raws.after = '\n'; rule.raws.before = '\n'; });
        css.walkAtRules(rule => { rule.raws.after = '\n'; rule.raws.before = '\n'; });
        if (css.nodes[0]) { css.nodes[0].raws.before = ''; }
    }
});