
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var ConfigValidator = require('./config-validator');
var ConfigPathNormalizer = require('./config-path-normalizer');
var ConfigHostDecorator = require('./config-host-decorator');

var MakefileBuilder = require('./makefile-builder');

var GccLikeCompilerGenerator = require('./gcc-like-compiler-generator');
var ClCompilerGenerator = require('./cl-compiler-generator');
var CompilerGeneratorSelector = require('./compiler-generator-selector');

var compilers = {
    clang: {
        name: 'clang',
        variables: function (options) {
            options.compiler = 'clang';
            return GccLikeCompilerGenerator.variables(options);
        },
        compilerCommand: GccLikeCompilerGenerator.compilerCommand,
        linkerCommand: GccLikeCompilerGenerator.linkerCommand
    },
    gcc: {
        name: 'gcc',
        variables: function (options) {
            options.compiler = 'gcc';
            return GccLikeCompilerGenerator.variables(options);
        },
        compilerCommand: GccLikeCompilerGenerator.compilerCommand,
        linkerCommand: GccLikeCompilerGenerator.linkerCommand
    },
    cl: {
        name: 'cl',
        variables: ClCompilerGenerator.variables,
        compilerCommand: ClCompilerGenerator.compilerCommand,
        linkerCommand: ClCompilerGenerator.linkerCommand
    }
};

var generateTargets = function (generate, artifacts) {
    var targets = [];
    artifacts.forEach(function (artifact) {
        var commands = [];

        artifact.files.forEach(function (file) {
            commands.push(
                generate.compilerCommand({
                    type: artifact.type,
                    file: file,
                    includePaths: artifact.includePaths,
                    flags: artifact.compilerFlags
                })
            );
        });

        commands.push(
            generate.linkerCommand({
                files: artifact.files,
                outputName: artifact.outputName,
                outputPath: artifact.outputPath,
                libraryPaths: artifact.libraryPaths,
                libraries: artifact.libraries,
                type: artifact.type,
                flags: artifact.linkerFlags
            })
        );

        targets.push({
            name: artifact.outputName,
            commands: commands
        });
    });

    return targets;
};

var generateVariables = function (generate) {
    return generate.variables({ compiler: generate.name });
};

var fileFromContents = function (contents) {
    return { isFile: true, contents: contents };
};

var validateConfig = function (configuration) {
    var validationResult = ConfigValidator.validate(configuration);

    if (validationResult.valid === false) {
        throw new Error(validationResult.error + ': ' + validationResult.property);
    }
};

var modifyConfig = function (configuration) {
    ConfigHostDecorator.decorate(configuration);
    ConfigPathNormalizer.normalize(configuration.artifacts[0]);
};

var selectGenerator = function (configuration) {
    var host = configuration.host;
    return CompilerGeneratorSelector.select(host, compilers);
};

var generateMakefileFromConfiguration = function (configuration) {
    var generator = selectGenerator(configuration);
    var variables = generateVariables(generator);
    var targets = generateTargets(generator, configuration.artifacts);
    return MakefileBuilder.build(variables, targets);
};

module.exports.generate = function (configuration) {
    validateConfig(configuration);
    modifyConfig(configuration);

    var makefile = generateMakefileFromConfiguration(configuration);

    return {
        'Makefile': fileFromContents(makefile)
    };
};
