
var ConfigValidator = require('./config-validator');
var ConfigPathNormalizer = require('./config-path-normalizer');
var ConfigHostDecorator = require('./config-host-decorator');

var MakefileBuilder = require('./makefile-builder');

var GccLikeCompilerGenerator = require('./gcc-like-compiler-generator');
var ClCompilerGenerator = require('./cl-compiler-generator');
var CompilerGeneratorSelector = require('./compiler-generator-selector');

var compilers = {
    clang: {
        compilerCommand: function (options) {
            return GccLikeCompilerGenerator.compilerCommand('clang', options);
        },
        linkerCommand: function (options) {
            return GccLikeCompilerGenerator.linkerCommand('clang', options);
        }
    },
    gcc: {
        compilerCommand: function (options) {
            return GccLikeCompilerGenerator.compilerCommand('gcc', options);
        },
        linkerCommand: function (options) {
            return GccLikeCompilerGenerator.linkerCommand('gcc', options);
        }
    },
    cl: {
        compilerCommand: ClCompilerGenerator.compilerCommand,
        linkerCommand: ClCompilerGenerator.linkerCommand
    }
};

var generateTargets = function (configuration) {
    var targets = [];
    configuration.artifacts.forEach(function (artifact) {
        var commands = [];
        var objectFiles = [];

        var generate = CompilerGeneratorSelector.select(artifact.host, compilers);

        artifact.files.forEach(function (file) {
            commands.push(
                generate.compilerCommand({
                    type: artifact.type,
                    file: file,
                    includePaths: artifact.includePaths,
                    flags: artifact.compilerFlags
                })
            );

            objectFiles.push(file + '.o');
        });

        commands.push(
            generate.linkerCommand({
                objectFiles: objectFiles,
                outputName: artifact.outputName,
                outputPath: artifact.outputPath,
                libraryPaths: artifact.libraryPaths,
                flags: artifact.linkerFlags,
                libraries: artifact.libraries,
                type: artifact.type
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

    var targets = generateTargets(configuration);

    return {
        'Makefile': {
            isFile: true,
            contents: MakefileBuilder.build(targets)
        }
    };
};
