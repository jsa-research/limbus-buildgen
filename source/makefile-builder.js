
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var variableDefinitionsFromMap = function (variables) {
    var definitions = '';
    for (var variableName in variables) {
        if (variables.hasOwnProperty(variableName)) {
            definitions += variableName + '=' + variables[variableName] + '\n';
        }
    }
    return definitions;
};

var targetDefinitionFromConfiguration = function (configuration, lastConfiguration, isLastConfiguration, isFirstConfiguration) {
    var dependencies = '';
    var name = configuration.name;

    if (!isFirstConfiguration) {
        dependencies = ' ' + lastConfiguration.name;
    }

    if (isLastConfiguration) {
        name = 'all';
    }

    return name + ':' + dependencies +
           '\n\t' + configuration.commands.join('\n\t') +
           '\n';
};

exports.build = function (variablesMap, configurations) {
    var targets = [];
    var variables = '';

    if (!Array.isArray(variablesMap)) {
        variables = variableDefinitionsFromMap(variablesMap);
    } else {
        configurations = variablesMap;
    }

    configurations.forEach(function (configuration, configurationIndex) {
        var isLastConfiguration = configurationIndex === configurations.length - 1;
        var isFirstConfiguration = configurationIndex === 0;
        var lastConfiguration = configurations[configurationIndex - 1];

        targets.push(targetDefinitionFromConfiguration(
            configuration,
            lastConfiguration,
            isLastConfiguration,
            isFirstConfiguration
        ));
    });

    targets.reverse();

    return variables + targets.join('');
};
