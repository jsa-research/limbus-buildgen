
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

exports.build = function (variables, configurations) {
    var targets = [];
    var variableString = '';

    if (!Array.isArray(variables)) {
        for (var variableName in variables) {
            if (variables.hasOwnProperty(variableName)) {
                variableString += variableName + '=' + variables[variableName] + '\n';
            }
        }
    } else {
        configurations = variables;
    }

    for (var configurationIndex = 0; configurationIndex < configurations.length; configurationIndex++) {
        var configuration = configurations[configurationIndex];

        var dependency;
        if (configurationIndex > 0) {
            dependency = configurations[configurationIndex - 1].name;
        }

        var name = configuration.name;
        if (configurationIndex === configurations.length - 1) {
            name = 'all';
        }

        targets.push(
             name + ':' + (dependency ? ' ' + dependency : '')
             + '\n\t' + configuration.commands.join('\n\t')
             + '\n'
        );
    }

    targets.reverse();

    return variableString + targets.join('');
};
