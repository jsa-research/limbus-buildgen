
var _ = require('./publicdash');

exports.build = function (targets) {
    return _.reduce(targets, function (makefile, commands, target) {
                return makefile
                     + target + ':'
                     + '\n\t' + commands.join('\n\t')
                     + '\n';
            }, '');
};
