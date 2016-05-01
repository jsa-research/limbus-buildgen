
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

var generateTargets = function (generate, configuration) {
    var targets = [];
    configuration.artifacts.forEach(function (artifact) {
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

module.exports.generate = function (configuration) {
    var validationResult = ConfigValidator.validate(configuration);

    if (validationResult.valid === false) {
        throw new Error(validationResult.error + ': ' + validationResult.property);
    }

    ConfigHostDecorator.decorate(configuration);
    ConfigPathNormalizer.normalize(configuration.artifacts[0]);

    var host = configuration.artifacts[0].host;
    var generate = CompilerGeneratorSelector.select(host, compilers);

    var variables = generate.variables({
        compiler: generate.name
    });
    var targets = generateTargets(generate, configuration);

    return {
        'Makefile': {
            isFile: true,
            contents: MakefileBuilder.build(variables, targets)
        }
    };
};
